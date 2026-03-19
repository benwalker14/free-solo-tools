import type { FAQ } from "./tool-faqs";

export const toolFaqsBatch3: Record<string, FAQ[]> = {
  "css-animation": [
    {
      question: "How do I create a CSS keyframe animation?",
      answer:
        "CSS keyframe animations are defined using the @keyframes rule, which specifies styles at various points during the animation cycle. You declare a name for the animation, then define keyframes using percentage values (0% to 100%) or the keywords 'from' and 'to'. Apply the animation to an element using the animation shorthand property, which combines animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, and animation-play-state. For example, a fade-in animation would set opacity from 0 at 0% to 1 at 100%, then apply it with a duration like 0.3s ease-in.",
    },
    {
      question: "What is the difference between CSS transitions and CSS animations?",
      answer:
        "CSS transitions animate between two states when a property changes, typically triggered by user interaction like hover or focus. CSS animations use @keyframes to define multi-step sequences that can run automatically, loop indefinitely, and animate through multiple intermediate states. Transitions are simpler and require a trigger event, while animations offer more control with features like iteration count, direction (normal, reverse, alternate), fill mode, and the ability to pause and resume. Use transitions for simple state changes like button hovers, and use keyframe animations for complex sequences like loading spinners, entrance effects, or any animation that needs to run without user interaction.",
    },
    {
      question: "What does animation-fill-mode do in CSS?",
      answer:
        "The animation-fill-mode property controls how a CSS animation applies styles before and after execution. It accepts four values: 'none' (default) applies no styles outside the animation, 'forwards' retains the styles from the last keyframe after the animation ends, 'backwards' applies the first keyframe styles during the delay period before the animation starts, and 'both' combines forwards and backwards behavior. This property is essential when you want an element to stay in its final animated state rather than snapping back. For example, if you animate an element's opacity from 0 to 1, setting fill-mode to 'forwards' keeps it visible after the animation completes.",
    },
  ],
  "markdown-table": [
    {
      question: "How do I create a table in Markdown?",
      answer:
        "Markdown tables use pipes (|) and hyphens (-) to define columns and rows. The first row contains headers separated by pipes, the second row uses hyphens to create a separator line, and subsequent rows contain data cells. Column alignment is controlled by adding colons to the separator row: left-align with ':---', right-align with '---:', and center with ':---:'. Each row must have the same number of pipe-separated cells. While manually writing tables is tedious, visual table builders let you create and edit tables interactively, then copy the generated Markdown syntax. Most Markdown renderers including GitHub, GitLab, and static site generators support this table syntax.",
    },
    {
      question: "How do I convert CSV data to a Markdown table?",
      answer:
        "To convert CSV data to a Markdown table, each CSV row becomes a pipe-delimited Markdown row, with a header separator inserted after the first row. The conversion process parses the CSV respecting quoted fields and commas within values, maps the first row to table headers, generates the alignment separator row with hyphens, and formats each subsequent row as a pipe-delimited table row. Special characters within cell values may need escaping, particularly pipe characters which should be written as '\\|'. This conversion is useful when you have spreadsheet data or database exports that need to be included in README files, documentation, or GitHub issues.",
    },
    {
      question: "What is the maximum number of columns in a Markdown table?",
      answer:
        "Markdown itself has no specification-defined limit on the number of columns in a table. However, practical limits exist based on readability and rendering. Most Markdown renderers handle tables with dozens of columns, but tables wider than 5-7 columns become difficult to read in raw Markdown source. GitHub renders wide tables with horizontal scrolling, while some static site generators may clip or overflow wide tables depending on CSS. For raw Markdown editing, keeping tables under 80-100 characters per row improves readability. If you need many columns, consider splitting the data across multiple tables or using an alternative format like HTML tables embedded in your Markdown document.",
    },
  ],
  "text-binary": [
    {
      question: "How do I convert text to binary?",
      answer:
        "Text-to-binary conversion works by taking each character's numeric code point and expressing it in base-2. For ASCII text, each character maps to a 7-bit or 8-bit binary number. The letter 'A' has the decimal value 65, which converts to binary 01000001. A space character is 00100000 (decimal 32). To convert a full string, each character is processed individually and the resulting binary values are typically separated by spaces for readability. UTF-8 text uses variable-length encoding where characters may require 1 to 4 bytes. This conversion is fundamental to understanding how computers store and transmit text data at the hardware level.",
    },
    {
      question: "What is the difference between binary, octal, decimal, and hexadecimal?",
      answer:
        "These are numeral systems with different bases. Binary (base-2) uses digits 0-1 and is the native language of computers. Octal (base-8) uses digits 0-7 and was historically used in computing for its compact representation of 3-bit groups. Decimal (base-10) uses digits 0-9 and is the standard human counting system. Hexadecimal (base-16) uses digits 0-9 and letters A-F, providing a compact way to represent binary data since each hex digit maps to exactly 4 bits. The decimal number 255 is 11111111 in binary, 377 in octal, and FF in hexadecimal. Hex is widely used for color codes, memory addresses, and byte-level data representation.",
    },
    {
      question: "How do I decode binary back to text?",
      answer:
        "To decode binary back to text, split the binary string into groups of 8 bits (one byte each), convert each group from base-2 to its decimal value, then map that decimal value to the corresponding character using the ASCII or UTF-8 encoding table. For example, the binary sequence 01001000 01101001 converts to decimal values 72 and 105, which map to the characters 'H' and 'i', producing the text 'Hi'. When decoding UTF-8, some characters use multiple bytes, so the leading bits of each byte indicate whether it starts a new character or continues one. Invalid binary sequences that do not map to valid characters will produce decoding errors.",
    },
  ],
  "meta-tag-generator": [
    {
      question: "What meta tags are essential for SEO?",
      answer:
        "The most important meta tags for SEO are the title tag and meta description. The title tag (technically not a meta tag but an HTML element) should be 50-60 characters and contain your primary keyword. The meta description should be 150-160 characters and provide a compelling summary that encourages clicks from search results. The viewport meta tag is critical for mobile responsiveness and affects mobile search rankings. The robots meta tag controls search engine crawling and indexing behavior. The canonical link tag prevents duplicate content issues. While meta keywords are ignored by Google, Open Graph and Twitter Card tags improve how your pages appear when shared on social media platforms.",
    },
    {
      question: "What are Open Graph meta tags and why do they matter?",
      answer:
        "Open Graph meta tags are a protocol created by Facebook that controls how your web pages appear when shared on social media platforms. The core tags are og:title, og:description, og:image, and og:url. When someone shares a link on Facebook, LinkedIn, Discord, Slack, or other platforms, these tags determine the preview card's title, description, and image. Without Open Graph tags, platforms attempt to auto-generate previews which are often inaccurate or missing images. The og:image tag is particularly important and should point to an image at least 1200x630 pixels for optimal display. Twitter uses its own twitter:card meta tags but falls back to Open Graph values when Twitter-specific tags are absent.",
    },
    {
      question: "How do I add Twitter Card meta tags to my website?",
      answer:
        "Twitter Card meta tags control how your links appear in tweets and are added in the HTML head section. Set twitter:card to either 'summary' for a small square image or 'summary_large_image' for a wide banner image. Add twitter:title for the card title, twitter:description for the summary text, and twitter:image for the preview image URL. Optionally include twitter:site with your website's Twitter handle. Images for summary cards should be at least 144x144 pixels, while large image cards need at least 300x157 pixels with a recommended size of 1200x628 pixels. You can validate your tags using Twitter's Card Validator tool before publishing to ensure proper rendering.",
    },
  ],
  "json-schema": [
    {
      question: "What is JSON Schema and what is it used for?",
      answer:
        "JSON Schema is a declarative language for defining the structure, content, and format of JSON data. It allows you to specify required properties, data types, string patterns, numeric ranges, array constraints, and nested object structures. JSON Schema is used for API request/response validation, configuration file validation, form generation, code generation, and documentation. Draft 07 is one of the most widely supported versions across programming languages and tools. Validators check JSON data against a schema and return detailed error messages identifying exactly which fields fail validation and why. This makes it invaluable for ensuring data quality in APIs, message queues, and configuration management systems.",
    },
    {
      question: "How do I validate required fields in JSON Schema?",
      answer:
        "Required fields in JSON Schema are specified using the 'required' keyword at the object level, which takes an array of property name strings. Define the property types in the 'properties' object, then list which ones are mandatory in the 'required' array. For example, to require 'name' and 'email' fields, add '\"required\": [\"name\", \"email\"]' alongside your properties definition. A validation error occurs when a required field is missing entirely from the JSON data. Note that a field present with a null value is not the same as a missing field unless you also restrict the type. For nested objects, each level needs its own 'required' array within that object's schema definition.",
    },
    {
      question: "What is the difference between JSON Schema Draft 04 and Draft 07?",
      answer:
        "JSON Schema Draft 07 introduced several improvements over Draft 04. The 'if/then/else' conditional keywords allow applying different schemas based on data values, replacing complex anyOf/oneOf workarounds. The 'const' keyword validates that a value equals an exact constant, simplifying single-value enums. Content-related keywords like 'contentEncoding' and 'contentMediaType' describe encoded string content. The 'readOnly' and 'writeOnly' annotations help document API request versus response fields. Draft 07 also added 'comment' for schema documentation and clarified boolean schema behavior where 'true' accepts everything and 'false' rejects everything. Most modern validators and tools default to Draft 07 due to its wide adoption and practical feature set.",
    },
  ],
  "subnet-calculator": [
    {
      question: "How do I calculate the number of usable hosts in a subnet?",
      answer:
        "The number of usable hosts in a subnet is calculated using the formula 2^(32-prefix) - 2, where the prefix is the CIDR notation number. The subtraction of 2 accounts for the network address (first address) and broadcast address (last address), which cannot be assigned to hosts. For example, a /24 subnet has 2^(32-24) - 2 = 254 usable hosts. A /30 subnet has 2^2 - 2 = 2 usable hosts, making it ideal for point-to-point links. A /31 subnet is a special case defined in RFC 3021 for point-to-point links with 2 usable addresses and no broadcast. A /32 represents a single host address used for loopback or host routes.",
    },
    {
      question: "What is CIDR notation and how does it relate to subnet masks?",
      answer:
        "CIDR (Classless Inter-Domain Routing) notation expresses an IP address and its associated subnet mask as a compact format like 192.168.1.0/24. The number after the slash indicates how many bits of the 32-bit address are used for the network portion. A /24 corresponds to subnet mask 255.255.255.0, meaning the first 24 bits identify the network and the remaining 8 bits identify hosts. Common CIDR-to-mask mappings include /8 = 255.0.0.0, /16 = 255.255.0.0, /24 = 255.255.255.0, and /28 = 255.255.255.240. CIDR replaced the older classful addressing system (Class A, B, C) to allow more flexible allocation of IP address space and reduce routing table sizes.",
    },
    {
      question: "What is VLSM and when should I use it?",
      answer:
        "VLSM (Variable Length Subnet Masking) is a technique that allows dividing a network into subnets of different sizes, each with a different prefix length. Unlike fixed-length subnetting where all subnets are the same size, VLSM lets you allocate address space efficiently by matching subnet sizes to actual host requirements. For example, a department with 100 hosts gets a /25 (126 hosts), while a point-to-point link gets a /30 (2 hosts). To implement VLSM, sort your requirements from largest to smallest, allocate the largest subnet first from the available address space, then subdivide remaining space for smaller subnets. VLSM is essential for efficient IPv4 address conservation in enterprise networks.",
    },
  ],
  "gitignore-generator": [
    {
      question: "What should I include in a .gitignore file?",
      answer:
        "A .gitignore file should exclude files that do not belong in version control: build artifacts (dist/, build/, *.o, *.class), dependency directories (node_modules/, venv/, vendor/), environment files with secrets (.env, .env.local), IDE and editor files (.vscode/, .idea/, *.swp), OS-generated files (.DS_Store, Thumbs.db), log files (*.log, npm-debug.log), compiled output (*.pyc, __pycache__/), and local configuration files. Never commit API keys, passwords, database credentials, or private certificates. Package lock files (package-lock.json, yarn.lock) should generally be committed as they ensure reproducible installs. The specific patterns depend on your language, framework, and development environment.",
    },
    {
      question: "How does .gitignore pattern matching work?",
      answer:
        "Gitignore patterns use glob-style matching with specific rules. A pattern without a slash matches files anywhere in the repository. A leading slash anchors the pattern to the repository root. A trailing slash matches only directories. The asterisk (*) matches anything except a slash, double asterisk (**) matches across directories, and question mark (?) matches a single character. Negation patterns starting with exclamation mark (!) re-include previously excluded files. Patterns are evaluated top to bottom with later rules overriding earlier ones. For example, '*.log' ignores all log files everywhere, '/build/' ignores only the root build directory, and 'doc/**/*.pdf' ignores PDFs only within the doc directory tree.",
    },
    {
      question: "Why are my .gitignore rules not working for already tracked files?",
      answer:
        "Gitignore only prevents untracked files from being added to the repository. Files already tracked by Git are not affected by .gitignore rules. To stop tracking a file that was previously committed, you must explicitly remove it from Git's index using 'git rm --cached <file>' for a single file or 'git rm -r --cached <directory>' for a directory. After removing from the index, commit the change, and the .gitignore rule will then take effect. To reset all tracked files against your .gitignore, run 'git rm -r --cached .' followed by 'git add .' and commit. Be careful with this approach in shared repositories as it may affect other contributors.",
    },
  ],
  "cron-generator": [
    {
      question: "What is the format of a cron expression?",
      answer:
        "A standard cron expression consists of five fields separated by spaces: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-7, where both 0 and 7 represent Sunday). Special characters include asterisk (*) for any value, comma (,) for lists, hyphen (-) for ranges, and slash (/) for step values. For example, '0 9 * * 1-5' runs at 9:00 AM Monday through Friday, '*/15 * * * *' runs every 15 minutes, and '0 0 1 * *' runs at midnight on the first of each month. Some systems like Quartz and AWS support a sixth field for seconds and a seventh for year.",
    },
    {
      question: "How do I schedule a cron job to run every 5 minutes?",
      answer:
        "To run a cron job every 5 minutes, use the expression '*/5 * * * *'. The */5 in the minute field means every 5th minute starting from 0, so it triggers at minutes 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, and 55 of every hour. Similarly, */10 runs every 10 minutes and */30 runs every 30 minutes. If you need every 5 minutes only during business hours, use '*/5 9-17 * * 1-5' which restricts execution to 9 AM through 5 PM on weekdays. On Linux, edit your crontab with 'crontab -e' and add the expression followed by the command to execute.",
    },
    {
      question: "What is the difference between cron and crontab?",
      answer:
        "Cron is the time-based job scheduling daemon that runs in the background on Unix-like operating systems, automatically executing commands at specified intervals. Crontab (cron table) is the configuration file that contains the schedule entries defining when each job should run. Each user can have their own crontab file managed through the 'crontab' command: 'crontab -e' to edit, 'crontab -l' to list, and 'crontab -r' to remove. System-wide cron jobs are typically placed in /etc/crontab or as files in /etc/cron.d/ directories. The key distinction is that cron is the service that reads and executes schedules, while crontab is the file format and command for managing those schedules.",
    },
  ],
  "favicon-generator": [
    {
      question: "What favicon sizes do I need for a modern website?",
      answer:
        "Modern websites need several favicon sizes for full browser and device coverage. The essential set includes: favicon.ico at 32x32 pixels (or multi-size with 16x16 and 32x32) for legacy browser support, a 180x180 PNG for Apple Touch Icon used on iOS home screens, a 192x192 and 512x512 PNG for Android Chrome specified in the web app manifest, and an SVG favicon for scalable display in modern browsers. The SVG format is increasingly preferred because it scales perfectly to any size and supports dark mode via CSS media queries. Include the appropriate link tags in your HTML head: rel='icon' for the favicon, rel='apple-touch-icon' for iOS, and reference the manifest.json for Android.",
    },
    {
      question: "How do I add a favicon to my website?",
      answer:
        "Add a favicon by placing the icon files in your site's root directory and adding link tags in the HTML head section. The minimum setup requires '<link rel=\"icon\" href=\"/favicon.ico\" sizes=\"32x32\">' for the classic favicon. For comprehensive support, add '<link rel=\"icon\" href=\"/favicon.svg\" type=\"image/svg+xml\">' for modern browsers, '<link rel=\"apple-touch-icon\" href=\"/apple-touch-icon.png\">' for iOS devices, and a web app manifest linking to larger PNG icons for Android. Place favicon.ico at the root of your domain because browsers automatically check for /favicon.ico even without a link tag. Most modern frameworks like Next.js, Gatsby, and Nuxt have built-in favicon configuration in their metadata systems.",
    },
    {
      question: "Can I use an emoji or text as a favicon?",
      answer:
        "Yes, you can use an emoji or text character as a favicon by rendering it onto a canvas element and converting it to an image format. SVG favicons make this especially straightforward by embedding text directly: use an SVG with a text element containing your chosen emoji or letter, styled with appropriate font size and positioning. The SVG approach is resolution-independent and results in crisp display at any size. For broader compatibility, render the emoji or text onto an HTML canvas at multiple sizes (16x16, 32x32, 180x180, 192x192) and export as PNG files. Emoji favicons are popular for personal sites, documentation, and developer tools because they require no graphic design work and are instantly recognizable.",
    },
  ],
  "slug-generator": [
    {
      question: "What is a URL slug and why does it matter for SEO?",
      answer:
        "A URL slug is the human-readable portion of a URL that identifies a specific page, typically appearing after the domain name. For example, in 'example.com/blog/how-to-use-git', the slug is 'how-to-use-git'. URL slugs matter for SEO because search engines use them as a ranking signal to understand page content. A descriptive slug containing relevant keywords helps search engines and users understand what the page is about before clicking. Best practices include using lowercase letters, separating words with hyphens (not underscores), keeping slugs concise (3-5 words), removing stop words like 'the' and 'and', and avoiding special characters. Clean slugs also improve link sharing and user trust.",
    },
    {
      question: "How do I handle Unicode characters in URL slugs?",
      answer:
        "Unicode characters in URL slugs are typically handled through transliteration, which converts non-ASCII characters to their closest ASCII equivalents. For example, accented characters like 'e' with accent become 'e', German umlauts like 'u' with umlaut become 'ue', and characters like 'n' with tilde become 'n'. CJK (Chinese, Japanese, Korean) characters and other scripts without direct Latin equivalents can be either transliterated using romanization systems (pinyin for Chinese, romaji for Japanese) or percent-encoded. Most slug generators strip characters that cannot be transliterated. While modern browsers display UTF-8 URLs correctly, ASCII-only slugs ensure maximum compatibility across all systems, email clients, and social media platforms.",
    },
    {
      question: "Should I use hyphens or underscores in URL slugs?",
      answer:
        "Use hyphens (-) rather than underscores (_) in URL slugs. Google treats hyphens as word separators, meaning 'web-development' is interpreted as two separate words 'web' and 'development' for search indexing. Underscores are treated as word joiners, so 'web_development' is indexed as the single compound 'webdevelopment', which reduces search relevance. This distinction was confirmed by Google's Matt Cutts and remains the standard recommendation. Hyphens are also more readable in URLs and easier to distinguish visually. Most content management systems and static site generators default to hyphens for this reason. If you have existing URLs with underscores, set up 301 redirects to hyphenated versions rather than changing URLs without redirects.",
    },
  ],
  "curl-converter": [
    {
      question: "How do I convert a cURL command to JavaScript fetch?",
      answer:
        "To convert a cURL command to JavaScript fetch, map the cURL options to fetch API parameters. The URL becomes fetch's first argument. The -X method flag maps to the 'method' option. Headers specified with -H become entries in the 'headers' object. The -d or --data flag content becomes the 'body' parameter. For example, 'curl -X POST -H \"Content-Type: application/json\" -d '{\"key\":\"value\"}' https://api.example.com' converts to fetch('https://api.example.com', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'value' }) }). Authentication flags like -u map to an Authorization header with base64-encoded credentials.",
    },
    {
      question: "What cURL options are supported in code conversion?",
      answer:
        "Most common cURL options have direct equivalents in HTTP client libraries. The widely supported options include: -X/--request for HTTP method, -H/--header for custom headers, -d/--data for request body, -u/--user for basic authentication, -b/--cookie for sending cookies, -L/--location for following redirects, -k/--insecure for skipping SSL verification, -F/--form for multipart form data, --data-urlencode for URL-encoded data, -A/--user-agent for the User-Agent header, and -o/--output for saving responses. Query parameters appended to the URL carry over directly. Some cURL-specific options like --compressed, --connect-timeout, and proxy settings have equivalent configurations in most languages but may require additional library setup.",
    },
    {
      question: "How do I handle authentication when converting cURL to Python?",
      answer:
        "When converting cURL authentication to Python's requests library, the -u flag maps directly to the 'auth' parameter. The cURL command 'curl -u username:password https://api.example.com' becomes requests.get('https://api.example.com', auth=('username', 'password')). For Bearer token authentication using '-H \"Authorization: Bearer TOKEN\"', pass it in the headers dictionary. For API key authentication, the header maps directly: headers={'X-API-Key': 'your-key'}. OAuth 2.0 tokens from cURL's -H flag also convert to headers. Python requests supports custom authentication classes for complex schemes. The requests library automatically handles base64 encoding for basic auth, unlike some languages where you must encode credentials manually.",
    },
  ],
  "json-to-csv": [
    {
      question: "How do I convert nested JSON to flat CSV?",
      answer:
        "Converting nested JSON to flat CSV requires flattening the hierarchical structure into a single row per record. Nested objects are typically flattened using dot notation for column names, so {'user': {'name': 'John', 'age': 30}} becomes columns 'user.name' and 'user.age'. Nested arrays can be handled by creating separate rows for each array element, joining values into a single cell with a delimiter, or creating indexed columns like 'tags.0', 'tags.1'. The best approach depends on your use case: separate rows work for one-to-many relationships in database imports, while joined values suit spreadsheet analysis. Choose consistent flattening strategies to maintain data integrity and ensure the CSV can be reliably parsed back.",
    },
    {
      question: "What characters need escaping in CSV files?",
      answer:
        "In CSV files following RFC 4180, fields containing commas, double quotes, or newlines must be enclosed in double quotes. Double quote characters within a quoted field must be escaped by doubling them, so a value like 'He said \"hello\"' becomes '\"He said \"\"hello\"\"\"' in the CSV. Leading and trailing whitespace is preserved within quoted fields. If your data contains the delimiter character (usually a comma), the entire field must be quoted. Some implementations also quote fields containing the record separator (newline). Tab-separated values (TSV) avoid many escaping issues since tabs rarely appear in data. When generating CSV from JSON, always apply proper quoting rules to prevent downstream parsing errors in spreadsheet applications.",
    },
    {
      question: "How do I select specific columns when converting JSON to CSV?",
      answer:
        "Column selection when converting JSON to CSV involves specifying which JSON properties to include as CSV columns and in what order. Start by analyzing the JSON structure to identify all available fields, especially in arrays where objects may have inconsistent keys. Select the relevant fields either by explicitly listing desired column names or by excluding unwanted ones. For nested JSON, decide the flattening depth and which nested properties to promote to top-level columns. Missing values in selected columns should be represented as empty strings in the CSV output. Column ordering matters for readability: place identifying fields like ID and name first, group related fields together, and put less important or optional fields at the end.",
    },
  ],
  "tailwind-generator": [
    {
      question: "How do I build responsive layouts with Tailwind CSS?",
      answer:
        "Tailwind CSS uses mobile-first responsive prefixes that apply styles at specific breakpoints and above. The default breakpoints are sm (640px), md (768px), lg (1024px), xl (1280px), and 2xl (1536px). Write base styles for mobile, then add prefixed utilities for larger screens. For example, 'w-full md:w-1/2 lg:w-1/3' makes an element full-width on mobile, half-width on tablets, and one-third width on desktops. Grid layouts use the same pattern: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' creates a responsive grid. You can customize breakpoints in tailwind.config.js. The mobile-first approach ensures your base styles work on the smallest screens without any prefix.",
    },
    {
      question: "What is the difference between Tailwind CSS and traditional CSS?",
      answer:
        "Tailwind CSS is a utility-first framework where you compose styles by applying pre-built utility classes directly in HTML, while traditional CSS involves writing custom stylesheets with semantic class names. Tailwind's approach eliminates context-switching between HTML and CSS files, reduces CSS file size through tree-shaking of unused utilities, and prevents specificity conflicts. Traditional CSS offers more semantic markup, easier global style changes, and a gentler learning curve. Tailwind generates small production bundles because only used utilities are included. The tradeoff is longer class strings in HTML versus separate stylesheet maintenance. Many teams use Tailwind with component frameworks like React or Vue where class repetition is managed through component abstraction rather than CSS cascading.",
    },
    {
      question: "How do I add custom colors and spacing in Tailwind CSS?",
      answer:
        "Custom colors and spacing in Tailwind CSS are configured in the tailwind.config.js file under the theme section. To add custom colors, extend the colors object: theme.extend.colors = { brand: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a5f' } }, which generates utilities like bg-brand-500, text-brand-50, and border-brand-900. For custom spacing, extend the spacing scale: theme.extend.spacing = { '18': '4.5rem', '128': '32rem' }, creating utilities like p-18, m-128, w-128, and h-18. Using 'extend' adds values without overriding defaults. Placing values directly in 'theme' replaces the default scale entirely. You can also use arbitrary values inline with bracket syntax like bg-[#1da1f2] or p-[13px] for one-off values.",
    },
  ],
  "og-preview": [
    {
      question: "How do I debug Open Graph tags that are not showing on social media?",
      answer:
        "When Open Graph tags do not display correctly on social media, start by verifying the tags exist in the page's HTML source (not rendered DOM). Use Facebook's Sharing Debugger (developers.facebook.com/tools/debug/) to scrape your URL and see exactly what Facebook reads. Common issues include: meta tags rendered by JavaScript which crawlers cannot execute, missing og:image with an absolute URL (relative paths fail), images smaller than the minimum 200x200 pixels, cached old tags requiring a manual re-scrape, and tags placed outside the head element. Twitter has its own Card Validator. LinkedIn's Post Inspector serves the same purpose. After fixing tags, always re-scrape to clear the platform's cache.",
    },
    {
      question: "What is the ideal Open Graph image size?",
      answer:
        "The ideal Open Graph image size is 1200x630 pixels with a 1.91:1 aspect ratio. This size works optimally across Facebook, LinkedIn, Twitter (for summary_large_image cards), Discord, Slack, and most other platforms that render link previews. Use a minimum of 600x315 pixels, though images below 1200px wide may appear lower quality on high-DPI displays. Keep the file size under 8MB (Facebook's limit), ideally under 1MB for fast loading. Use JPEG for photographs and PNG for graphics with text. Place important content in the center of the image since different platforms crop differently. Avoid text in the outer 10% of the image to prevent it from being cut off.",
    },
    {
      question: "How do Twitter Card tags differ from Open Graph tags?",
      answer:
        "Twitter Card tags use the 'twitter:' prefix and control how links appear in tweets, while Open Graph tags use the 'og:' prefix and were created by Facebook. Twitter Cards have a unique required tag, twitter:card, which specifies the card type: 'summary' for a small thumbnail, 'summary_large_image' for a wide banner, 'player' for video/audio, and 'app' for mobile app links. Open Graph has no equivalent to this card type selector. However, Twitter falls back to Open Graph tags when Twitter-specific tags are absent, so og:title, og:description, and og:image will be used if twitter:title, twitter:description, and twitter:image are not set. Most sites implement both for maximum control over appearance on each platform.",
    },
  ],
  "js-playground": [
    {
      question: "How does a browser-based JavaScript playground work?",
      answer:
        "A browser-based JavaScript playground executes code directly in the browser using the JavaScript engine built into the browser itself. The code runs in a sandboxed environment, typically using eval(), the Function constructor, or an iframe to isolate execution from the host page. Console methods like console.log are intercepted by overriding them to capture output and display it in a custom output panel instead of the browser's developer console. TypeScript support is achieved by running the TypeScript compiler (tsc) in the browser via WebAssembly or a bundled JavaScript version to transpile TypeScript to JavaScript before execution. Error handling wraps execution in try-catch blocks to display runtime errors without crashing the playground.",
    },
    {
      question: "Can I use npm packages in a JavaScript playground?",
      answer:
        "Most browser-based JavaScript playgrounds do not support npm packages directly because npm's module resolution and installation require Node.js and file system access. However, some advanced playgrounds use CDN services like esm.sh, skypack.dev, or unpkg.com to import packages via ES module URLs. For example, 'import lodash from \"https://esm.sh/lodash\"' loads lodash directly from a CDN. Simpler playgrounds focus on vanilla JavaScript and TypeScript execution without external dependencies. For full npm support with bundling, tools like StackBlitz and CodeSandbox run complete Node.js environments in the browser using WebContainers technology. If you need specific libraries, check whether the playground supports URL imports or CDN-based modules.",
    },
    {
      question: "What is the difference between running JavaScript in Node.js vs the browser?",
      answer:
        "JavaScript in the browser has access to Web APIs like the DOM, fetch, localStorage, Canvas, Web Workers, and browser events, while Node.js provides server-side APIs like fs (file system), http, path, child_process, and stream. The global object is 'window' in browsers and 'global' in Node.js (or 'globalThis' in both). Node.js supports CommonJS modules (require/module.exports) natively alongside ES modules, while browsers use ES modules with script type='module'. Browser JavaScript runs in a sandboxed environment with security restrictions, while Node.js has full operating system access. Both share the same core language features (ECMAScript), but their runtime environments and available APIs differ significantly based on their execution context.",
    },
  ],
  "json-diff": [
    {
      question: "How does JSON diff comparison work?",
      answer:
        "JSON diff comparison works by recursively traversing two JSON structures and identifying differences at each level. The algorithm parses both JSON inputs into object trees, then walks them simultaneously, comparing values at each key path. It detects three types of changes: additions (keys present in the second but not the first), deletions (keys present in the first but not the second), and modifications (same key with different values). For arrays, comparison can be index-based (comparing elements at the same position) or value-based (detecting moved elements). The output typically shows each difference with its JSON path, the old value, and the new value, often color-coded as green for additions, red for deletions, and yellow for modifications.",
    },
    {
      question: "What is the difference between a structural diff and a semantic diff for JSON?",
      answer:
        "A structural diff compares JSON documents based on their exact text representation, including key ordering, whitespace, and formatting. A semantic diff compares the logical content, treating structurally different but semantically identical JSON as equal. For example, {\"a\":1,\"b\":2} and {\"b\":2,\"a\":1} are structurally different (different key order) but semantically identical (same data). Semantic diff normalizes both inputs before comparison: sorting object keys, standardizing number formats (1.0 vs 1), and ignoring whitespace. Most JSON diff tools perform semantic comparison by default since JSON object key order is not significant per the JSON specification. Use structural diff when the exact serialization format matters, such as for configuration files with enforced ordering conventions.",
    },
    {
      question: "How do I compare large JSON files efficiently?",
      answer:
        "Comparing large JSON files efficiently requires strategies that minimize memory usage and processing time. First, parse both JSON documents using streaming parsers if they exceed available memory. For focused comparison, extract only relevant subtrees using JSON Path queries before diffing. Many diff tools offer options to ignore specific keys or limit comparison depth, which reduces noise in the output. When comparing API responses, filter out volatile fields like timestamps and request IDs before diffing. For repeated comparisons of similar structures, normalize the JSON first by sorting keys and formatting consistently. Browser-based tools may struggle with files over 10MB, so consider command-line tools like jd, json-diff, or jq for very large files.",
    },
  ],
  "toml-converter": [
    {
      question: "What is TOML and how does it differ from JSON and YAML?",
      answer:
        "TOML (Tom's Obvious Minimal Language) is a configuration file format designed to be easy to read and write, with unambiguous semantics that map clearly to a hash table. Unlike JSON, TOML supports comments, has native date/time types, and does not require quotes around all keys. Unlike YAML, TOML avoids indentation-based nesting which eliminates a common source of errors. TOML uses explicit table headers in brackets like [section] and dot-separated keys for nested structures. It is the standard format for Rust's Cargo.toml, Python's pyproject.toml, and Hugo's config.toml. TOML files are generally more verbose than YAML for deeply nested structures but more readable and less error-prone for flat or moderately nested configurations.",
    },
    {
      question: "How do I convert Cargo.toml to JSON?",
      answer:
        "Converting Cargo.toml to JSON involves parsing the TOML structure and serializing it as JSON. TOML tables like [package] become JSON objects, TOML arrays of tables like [[bin]] become JSON arrays, and TOML's native types map directly: strings to JSON strings, integers and floats to JSON numbers, booleans to JSON booleans, and arrays to JSON arrays. TOML's datetime types have no JSON equivalent and are typically converted to ISO 8601 strings. Inline tables like {version = \"1.0\", features = [\"derive\"]} become nested JSON objects. Dotted keys like package.name expand into nested objects. Comments are lost during conversion since JSON has no comment syntax. The resulting JSON preserves all data values while changing only the serialization format.",
    },
    {
      question: "When should I use TOML instead of YAML for configuration?",
      answer:
        "Use TOML when your configuration is relatively flat or moderately nested, when you want unambiguous parsing without surprises, and when your ecosystem expects it (Rust, Python packaging, Hugo). TOML's explicit syntax means '123' is always a number and 'true' is always a boolean, unlike YAML where the Norway problem ('NO' being parsed as false) and similar type coercion issues cause subtle bugs. Use YAML when you have deeply nested structures, need anchors and aliases for repeated values, or when your tools require it (Kubernetes, Docker Compose, GitHub Actions). YAML is more concise for complex hierarchies but requires careful attention to indentation and type handling. For new projects without ecosystem constraints, TOML offers better safety guarantees.",
    },
  ],
  "encode-decode": [
    {
      question: "What is the difference between Base64 and Base32 encoding?",
      answer:
        "Base64 and Base32 are both binary-to-text encoding schemes but differ in their character sets and output size. Base64 uses 64 characters (A-Z, a-z, 0-9, +, /) and represents 6 bits per character, producing output that is approximately 33% larger than the input. Base32 uses 32 characters (A-Z, 2-7) and represents 5 bits per character, producing output approximately 60% larger than input. Base32's advantage is case insensitivity and avoidance of characters that are problematic in URLs, filenames, and human transcription (no 0/O or 1/I confusion). Base32 is used in TOTP two-factor authentication tokens, while Base64 is more common for email attachments (MIME), data URLs, and API payloads where compact encoding matters more than human readability.",
    },
    {
      question: "When should I use URL encoding vs Base64 encoding?",
      answer:
        "URL encoding (percent encoding) and Base64 serve different purposes. URL encoding converts special characters in URLs to percent-prefixed hex values (space becomes %20, ampersand becomes %26) to ensure URLs are valid according to RFC 3986. It is specifically for making strings safe within URL components like query parameters and path segments. Base64 encoding converts arbitrary binary data into an ASCII string representation, used when you need to embed binary data in text-based formats like JSON, XML, HTML data attributes, or email bodies. Use URL encoding for URL parameters and form submissions. Use Base64 for embedding images, files, or binary data in text contexts. They solve fundamentally different problems and are sometimes combined, such as Base64url encoding for JWT tokens.",
    },
    {
      question: "What is hex encoding and when is it used?",
      answer:
        "Hex (hexadecimal) encoding represents each byte of data as two hexadecimal characters (0-9, a-f), doubling the size of the original data. Each byte (8 bits) maps to exactly two hex digits since each hex digit represents 4 bits (a nibble). For example, the byte value 255 becomes 'ff' and the ASCII letter 'A' (byte value 65) becomes '41'. Hex encoding is widely used for cryptographic hash outputs (SHA-256 produces 64 hex characters for 32 bytes), color codes in CSS (#ff5733), MAC addresses (00:1A:2B:3C:4D:5E), memory addresses in debugging, and binary file inspection with hex editors. Its advantage over Base64 is simplicity and direct byte-level readability, though the output is larger.",
    },
  ],
  "docker-compose": [
    {
      question: "How do I validate a Docker Compose file?",
      answer:
        "Docker Compose files can be validated using the 'docker compose config' command, which parses and validates the YAML file against the Compose specification. This checks for syntax errors, invalid service configurations, undefined references, and type mismatches. Common validation issues include incorrect indentation (YAML is whitespace-sensitive), invalid port mappings, referencing undefined networks or volumes, using deprecated options, and version string mismatches. Online validators parse the YAML structure and check it against the Compose schema without requiring Docker to be installed. They verify that service definitions include required fields, port formats are valid, volume mount paths are properly formatted, environment variables follow correct syntax, and dependency references point to defined services.",
    },
    {
      question: "What is the difference between Docker Compose v2 and v3?",
      answer:
        "Docker Compose file format versions 2 and 3 differ primarily in their target deployment environments. Version 2 (2.x) was designed for single-host Docker Compose deployments and supports features like resource limits (mem_limit, cpu_shares), network link aliases, and extends for service inheritance. Version 3 (3.x) was designed for Docker Swarm compatibility and moves resource configuration under the 'deploy' key. Version 3 removed some v2 features like 'extends', 'volume_driver', and certain network options. As of Docker Compose V2 (the CLI tool, not the file format), the version field in compose files is optional and largely informational. The Compose Specification now serves as the canonical reference, unifying features from both versions.",
    },
    {
      question: "How do I define dependencies between services in Docker Compose?",
      answer:
        "Service dependencies in Docker Compose are defined using the 'depends_on' key, which controls startup and shutdown order. Basic syntax lists dependent services: depends_on: [db, redis]. However, depends_on only waits for the container to start, not for the service inside to be ready. For health-based dependencies, use the long syntax with a condition: depends_on: db: condition: service_healthy, which requires a healthcheck defined on the db service. Healthchecks use the 'healthcheck' key with test commands, intervals, timeouts, and retry counts. For production reliability, applications should also implement their own connection retry logic rather than relying solely on startup ordering, since services may restart or become temporarily unavailable during operation.",
    },
  ],
  "privacy-policy": [
    {
      question: "What must a privacy policy include under GDPR?",
      answer:
        "Under GDPR (General Data Protection Regulation), a privacy policy must include: the identity and contact details of the data controller, the purposes and legal basis for processing personal data, categories of personal data collected, any recipients or categories of recipients of the data, details of international data transfers including safeguards, data retention periods or criteria for determining them, individuals' rights (access, rectification, erasure, restriction, portability, objection), the right to withdraw consent, the right to lodge a complaint with a supervisory authority, whether providing data is a statutory or contractual requirement, and information about automated decision-making including profiling. The policy must be written in clear, plain language and be easily accessible.",
    },
    {
      question: "What is the difference between GDPR and CCPA privacy requirements?",
      answer:
        "GDPR (EU) and CCPA (California) both protect personal data but differ in scope and approach. GDPR applies to any organization processing EU residents' data regardless of location, while CCPA applies to businesses meeting specific revenue or data thresholds serving California residents. GDPR requires a legal basis for all data processing (consent, contract, legitimate interest), whereas CCPA uses an opt-out model where businesses can collect data by default but must allow consumers to opt out of data sales. CCPA gives consumers rights to know, delete, and opt out of sale, while GDPR provides broader rights including data portability and the right to restrict processing. GDPR fines reach 4% of global revenue, while CCPA penalties are $2,500-$7,500 per violation.",
    },
    {
      question: "Do I need a privacy policy if my website uses cookies?",
      answer:
        "Yes, if your website uses cookies, you need a privacy policy that discloses this practice and a cookie consent mechanism in most jurisdictions. The EU's ePrivacy Directive (Cookie Law) requires informed consent before setting non-essential cookies, and GDPR requires disclosure of cookie usage in your privacy policy. Your policy should explain what cookies you use, their purpose (analytics, advertising, functionality), who sets them (first-party vs third-party), their duration, and how users can manage or disable them. Even if you only use analytics cookies like Google Analytics, disclosure is required. The US has fewer federal cookie requirements, but CCPA requires disclosure if cookies enable data collection that constitutes a sale. Most websites implement a cookie banner alongside their privacy policy.",
    },
  ],
  "http-status-codes": [
    {
      question: "What is the difference between 401 and 403 HTTP status codes?",
      answer:
        "HTTP 401 Unauthorized means the request lacks valid authentication credentials. The server does not know who the client is and requires authentication before proceeding. It typically includes a WWW-Authenticate header indicating the accepted authentication scheme. HTTP 403 Forbidden means the server understands the request and knows who the client is (they may be authenticated) but refuses to authorize the action. The client does not have permission to access the resource. For example, a request without a login token returns 401, while a logged-in regular user trying to access an admin endpoint returns 403. Retrying a 401 with valid credentials may succeed, but retrying a 403 with the same identity will always fail since the permission is denied regardless of authentication.",
    },
    {
      question: "When should I use 200 vs 201 vs 204 HTTP status codes?",
      answer:
        "Use HTTP 200 OK for successful requests that return data, such as GET requests returning a resource or POST requests returning a result. Use 201 Created when a request successfully creates a new resource, typically for POST endpoints that create database records; include a Location header pointing to the new resource's URL. Use 204 No Content for successful requests that intentionally return no body, commonly used for DELETE operations, PUT/PATCH updates where the client does not need the updated resource back, and preflight CORS requests. The distinction matters for API consumers: 201 signals they should check the Location header, 204 signals there is no body to parse, and 200 signals a body containing the requested or resulting data.",
    },
    {
      question: "What do 5xx HTTP status codes mean?",
      answer:
        "5xx status codes indicate server-side errors where the server failed to fulfill a valid request. HTTP 500 Internal Server Error is the generic catch-all for unexpected server failures like unhandled exceptions or crashes. HTTP 502 Bad Gateway means a server acting as a gateway or proxy received an invalid response from an upstream server. HTTP 503 Service Unavailable indicates the server is temporarily unable to handle requests due to maintenance or overload, often including a Retry-After header. HTTP 504 Gateway Timeout means the upstream server did not respond in time. HTTP 507 Insufficient Storage indicates the server cannot store the data needed to complete the request. Unlike 4xx errors which are client problems, 5xx errors indicate issues the server operator needs to investigate and resolve.",
    },
  ],
};
