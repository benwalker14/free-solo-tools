import type { ToolSubpage } from "./tool-subpages";

export const batch4Subpages: Record<string, ToolSubpage[]> = {
  "diff-checker": [
    {
      slug: "text-diff",
      title: "Text Diff Checker",
      metaTitle: "Text Diff Checker Online — Free Online Tool | DevBolt",
      metaDescription:
        "Compare two blocks of text side by side and instantly see additions, deletions, and changes. Free client-side text diff tool with no data uploaded.",
      h1: "Text Diff Checker Online",
      intro:
        "Paste two pieces of text and instantly see every difference highlighted. This tool runs entirely in your browser — nothing is uploaded to a server.",
      content: [
        {
          heading: "What is a text diff?",
          body: "A text diff compares two versions of a document line by line and highlights what was added, removed, or modified. Diff algorithms power version control systems like Git, collaborative editing tools, and document review workflows. Understanding diffs is essential for tracking changes across any text-based content.",
        },
        {
          heading: "Common use cases",
          body: "Text diffs are used to compare configuration files before and after changes, review edits in legal or technical documents, verify content migrations, and audit changes in CSV or log files. Writers and editors use them to see exactly what changed between drafts without reading the entire document.",
        },
      ],
      faqs: [
        {
          question: "How does the text diff algorithm work?",
          answer:
            "The tool uses a longest common subsequence (LCS) algorithm to find the minimal set of changes between two texts. Lines are compared sequentially and classified as added, removed, or unchanged.",
        },
        {
          question: "Is my text data safe when using an online diff checker?",
          answer:
            "Yes. DevBolt's diff checker runs entirely in your browser using JavaScript. Your text is never sent to any server, so it remains completely private.",
        },
      ],
      keywords: [
        "text diff checker",
        "compare text online",
        "text comparison tool",
        "find differences in text",
        "online diff tool",
      ],
      parentToolSlug: "diff-checker",
      parentToolName: "Diff Checker",
    },
    {
      slug: "code-diff",
      title: "Code Diff Checker",
      metaTitle: "Code Diff Checker Online — Free Online Tool | DevBolt",
      metaDescription:
        "Compare two code snippets side by side with syntax-aware diff highlighting. Free, client-side code comparison tool — no data leaves your browser.",
      h1: "Code Diff Checker Online",
      intro:
        "Compare two code snippets and see exactly what changed with syntax-aware highlighting. All processing happens client-side — your code stays on your machine.",
      content: [
        {
          heading: "What is a code diff?",
          body: "A code diff visualizes the differences between two versions of source code. Unlike plain text diffs, code diffs are often displayed with syntax highlighting so developers can quickly identify meaningful changes versus whitespace or formatting shifts. Code diffs are the backbone of pull request reviews on platforms like GitHub and GitLab.",
        },
        {
          heading: "Common use cases",
          body: "Developers use code diffs to review pull requests, debug regressions by comparing working and broken versions, verify refactoring didn't change behavior, and audit third-party dependency updates. Code diffs are also useful when merging branches or resolving conflicts in version control.",
        },
      ],
      faqs: [
        {
          question: "Can I compare code in any programming language?",
          answer:
            "Yes. The diff engine works on any plain-text content regardless of language. The comparison is character- and line-based, so it supports JavaScript, Python, Java, Go, SQL, and any other language.",
        },
        {
          question: "Does the code diff ignore whitespace changes?",
          answer:
            "By default all changes are shown, including whitespace. You can use the tool's options to toggle whitespace-insensitive comparison if you only care about meaningful code changes.",
        },
      ],
      keywords: [
        "code diff checker",
        "compare code online",
        "code comparison tool",
        "source code diff",
        "online code diff viewer",
      ],
      parentToolSlug: "diff-checker",
      parentToolName: "Diff Checker",
    },
  ],

  "contrast-checker": [
    {
      slug: "wcag-aa-checker",
      title: "WCAG AA Contrast Checker",
      metaTitle: "WCAG AA Contrast Checker — Free Online Tool | DevBolt",
      metaDescription:
        "Check if your color combinations meet WCAG AA contrast requirements. Free client-side accessibility checker for text and background colors.",
      h1: "WCAG AA Contrast Checker",
      intro:
        "Verify that your foreground and background color pairs meet WCAG AA contrast minimums. This tool calculates contrast ratios entirely in your browser with instant results.",
      content: [
        {
          heading: "What is WCAG AA?",
          body: "WCAG AA is the mid-level conformance standard in the Web Content Accessibility Guidelines published by the W3C. For normal text, AA requires a contrast ratio of at least 4.5:1 between foreground and background colors. For large text (18pt or 14pt bold), the requirement is 3:1. Meeting AA is the most common legal and organizational accessibility target worldwide.",
        },
        {
          heading: "Common use cases",
          body: "Designers check WCAG AA compliance when selecting brand colors, building design systems, or creating UI mockups. Developers verify compliance during code review or QA testing. Meeting AA contrast is often required for government websites, educational platforms, and any organization subject to ADA, Section 508, or EN 301 549 regulations.",
        },
      ],
      faqs: [
        {
          question: "What contrast ratio is needed for WCAG AA?",
          answer:
            "WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt regular or 14pt bold and above).",
        },
        {
          question: "Is WCAG AA enough for accessibility compliance?",
          answer:
            "WCAG AA is the standard most regulations reference, including ADA and Section 508 in the US. It covers the majority of users with low vision and is considered sufficient for most websites and applications.",
        },
      ],
      keywords: [
        "wcag aa contrast checker",
        "wcag aa color contrast",
        "accessibility contrast ratio",
        "aa contrast requirements",
        "color accessibility checker",
      ],
      parentToolSlug: "contrast-checker",
      parentToolName: "Color Contrast Checker",
    },
    {
      slug: "wcag-aaa-checker",
      title: "WCAG AAA Contrast Checker",
      metaTitle: "WCAG AAA Contrast Checker — Free Online Tool | DevBolt",
      metaDescription:
        "Test your colors against WCAG AAA contrast standards. Free browser-based tool to ensure maximum readability and accessibility compliance.",
      h1: "WCAG AAA Contrast Checker",
      intro:
        "Test whether your color combinations meet the strictest WCAG AAA contrast thresholds. Everything runs client-side for instant, private results.",
      content: [
        {
          heading: "What is WCAG AAA?",
          body: "WCAG AAA is the highest conformance level in the Web Content Accessibility Guidelines. It requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text. While not always required by law, AAA conformance provides the best readability for users with moderate to severe vision impairments and benefits all users in challenging lighting conditions.",
        },
        {
          heading: "Common use cases",
          body: "Organizations pursuing best-in-class accessibility target WCAG AAA for critical content such as healthcare portals, financial dashboards, and emergency communications. It is also valuable for e-readers, kiosk interfaces, and any product where maximum readability directly impacts user safety or comprehension.",
        },
      ],
      faqs: [
        {
          question: "What contrast ratio does WCAG AAA require?",
          answer:
            "WCAG AAA requires a minimum contrast ratio of 7:1 for normal-sized text and 4.5:1 for large text (18pt or 14pt bold).",
        },
        {
          question: "Should I aim for WCAG AAA or AA?",
          answer:
            "Most organizations target AA as the baseline. AAA is ideal for critical-content interfaces like medical or financial apps. Achieving full AAA across an entire site can be difficult, but applying it to body text and key UI elements significantly improves readability.",
        },
      ],
      keywords: [
        "wcag aaa contrast checker",
        "wcag aaa color contrast",
        "7 to 1 contrast ratio",
        "aaa accessibility checker",
        "highest contrast standard",
      ],
      parentToolSlug: "contrast-checker",
      parentToolName: "Color Contrast Checker",
    },
  ],

  "json-path": [
    {
      slug: "jsonpath-syntax",
      title: "JSONPath Syntax Reference",
      metaTitle: "JSONPath Syntax Reference — Free Online Tool | DevBolt",
      metaDescription:
        "Complete JSONPath syntax reference with operators, wildcards, filters, and recursive descent. Test expressions live in your browser.",
      h1: "JSONPath Syntax Reference",
      intro:
        "Learn every JSONPath operator and expression type with clear explanations. Test your expressions instantly in the browser — no server requests, no data leaves your machine.",
      content: [
        {
          heading: "What is JSONPath?",
          body: "JSONPath is a query language for JSON, analogous to XPath for XML. It lets you extract specific values from deeply nested JSON structures using concise dot-notation or bracket-notation expressions. JSONPath was originally proposed by Stefan Goessner in 2007 and is now formalized in RFC 9535.",
        },
        {
          heading: "Core operators",
          body: "The root operator ($) refers to the top-level object. The dot operator (.) accesses child properties, while bracket notation (['key']) handles special characters in keys. The wildcard (*) matches all elements at a level, recursive descent (..) searches all descendants, and array slices ([start:end:step]) select ranges of array elements. Filter expressions ([?(@.price < 10)]) let you query arrays conditionally.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between dot notation and bracket notation in JSONPath?",
          answer:
            "Dot notation ($.store.book) is shorter and cleaner for simple property names. Bracket notation ($['store']['book']) is required when property names contain spaces, dots, or other special characters.",
        },
        {
          question: "Does JSONPath support filtering arrays?",
          answer:
            "Yes. Filter expressions like $..book[?(@.price < 10)] select array elements that match a condition. You can use comparison operators, logical AND/OR, and regular expressions in filters.",
        },
      ],
      keywords: [
        "jsonpath syntax",
        "jsonpath reference",
        "jsonpath operators",
        "jsonpath query language",
        "jsonpath expressions",
      ],
      parentToolSlug: "json-path",
      parentToolName: "JSON Path Tester",
    },
    {
      slug: "jsonpath-examples",
      title: "JSONPath Expression Examples",
      metaTitle: "JSONPath Expression Examples — Free Online Tool | DevBolt",
      metaDescription:
        "Practical JSONPath examples for common queries: nested access, array filtering, wildcards, and recursive search. Try each example live.",
      h1: "JSONPath Expression Examples",
      intro:
        "Browse practical JSONPath expression examples for everyday tasks. Each example can be tested live in the browser with no data sent to any server.",
      content: [
        {
          heading: "Why learn JSONPath by example?",
          body: "JSONPath syntax is compact but can be tricky with nested arrays and filter expressions. Working through real examples is the fastest way to build fluency. Each example below covers a common scenario like extracting nested fields, filtering arrays by value, and using wildcards for bulk extraction.",
        },
        {
          heading: "Common use cases",
          body: "JSONPath is used in API testing tools like Postman, configuration systems like Kubernetes, log analysis pipelines, and data transformation workflows. Developers use it to extract specific fields from large API responses, validate payloads in automated tests, and build dynamic queries in no-code platforms.",
        },
      ],
      faqs: [
        {
          question: "Can JSONPath select multiple fields at once?",
          answer:
            "Yes. You can use the union operator, e.g. $..book[0,1] to select the first two books, or combine with wildcards like $..book[*].title to extract the title from every book in the array.",
        },
        {
          question: "How do I filter JSON arrays with JSONPath?",
          answer:
            "Use the filter syntax [?(@.field operator value)]. For example, $..book[?(@.price < 15)] returns all books cheaper than 15. You can chain conditions with && and || operators.",
        },
      ],
      keywords: [
        "jsonpath examples",
        "jsonpath query examples",
        "jsonpath filter examples",
        "jsonpath array query",
        "jsonpath tutorial",
      ],
      parentToolSlug: "json-path",
      parentToolName: "JSON Path Tester",
    },
  ],

  "json-schema": [
    {
      slug: "json-schema-generator",
      title: "JSON Schema Generator",
      metaTitle: "JSON Schema Generator Online — Free Online Tool | DevBolt",
      metaDescription:
        "Generate a JSON Schema from any JSON object automatically. Free client-side tool that infers types, required fields, and structure instantly.",
      h1: "JSON Schema Generator Online",
      intro:
        "Paste a JSON object and instantly generate its corresponding JSON Schema. The tool runs entirely in your browser — your data never leaves your device.",
      content: [
        {
          heading: "What is a JSON Schema?",
          body: "JSON Schema is a vocabulary that lets you annotate and validate the structure of JSON documents. It defines expected data types, required properties, value constraints, and nested object shapes. JSON Schema is used in API documentation (OpenAPI/Swagger), form validation, configuration file validation, and data pipeline contracts.",
        },
        {
          heading: "Common use cases",
          body: "Developers generate schemas to bootstrap API validation middleware, create OpenAPI definitions from example payloads, enforce data contracts between microservices, and auto-generate TypeScript types. Generating a schema from an existing JSON sample is much faster than writing one by hand, especially for complex nested structures.",
        },
      ],
      faqs: [
        {
          question: "How accurate is the auto-generated schema?",
          answer:
            "The generator infers types and required fields from your sample data. It produces a valid schema that matches your input structure. You may want to fine-tune constraints like minLength, patterns, or enums for production use.",
        },
        {
          question: "Which JSON Schema draft does the generator use?",
          answer:
            "The generator produces schemas compatible with Draft-07, the most widely supported draft across validation libraries, OpenAPI 3.0, and tooling ecosystems.",
        },
      ],
      keywords: [
        "json schema generator",
        "generate json schema online",
        "json to schema",
        "auto generate json schema",
        "json schema from example",
      ],
      parentToolSlug: "json-schema",
      parentToolName: "JSON Schema Validator",
    },
    {
      slug: "json-schema-draft-07",
      title: "JSON Schema Draft-07 Validator",
      metaTitle: "JSON Schema Draft-07 Validator — Free Online Tool | DevBolt",
      metaDescription:
        "Validate JSON against a Draft-07 schema with detailed error messages. Free client-side validator — your data stays in your browser.",
      h1: "JSON Schema Draft-07 Validator",
      intro:
        "Validate your JSON data against a Draft-07 schema and get clear, actionable error messages. Everything runs client-side — no data is transmitted to any server.",
      content: [
        {
          heading: "What is JSON Schema Draft-07?",
          body: "Draft-07 (published 2018) is the most widely adopted version of the JSON Schema specification. It introduced conditional keywords like if/then/else, the readOnly and writeOnly annotations, and the contentMediaType/contentEncoding keywords. Most major validation libraries — including Ajv, jsonschema (Python), and everit-json-schema (Java) — fully support Draft-07.",
        },
        {
          heading: "Common use cases",
          body: "Draft-07 validation is used in CI/CD pipelines to validate configuration files, in API gateways to reject malformed requests, in form builders to enforce input rules, and in data engineering to validate records before loading into warehouses. Catching schema violations early prevents runtime errors and data corruption downstream.",
        },
      ],
      faqs: [
        {
          question: "Should I use Draft-07 or a newer draft?",
          answer:
            "Draft-07 has the broadest library and tooling support. Newer drafts (2019-09, 2020-12) add features like $dynamicRef and prefixItems, but many tools have not fully adopted them yet. Draft-07 is a safe, well-supported choice for most projects.",
        },
        {
          question: "What errors does the validator report?",
          answer:
            "The validator reports type mismatches, missing required properties, pattern violations, array length issues, enum mismatches, and conditional failures. Each error includes the JSON path to the problematic value and a human-readable message.",
        },
      ],
      keywords: [
        "json schema draft 07 validator",
        "json schema draft-07",
        "validate json schema online",
        "json schema validation tool",
        "draft-07 json validator",
      ],
      parentToolSlug: "json-schema",
      parentToolName: "JSON Schema Validator",
    },
  ],

  "word-counter": [
    {
      slug: "character-counter",
      title: "Character Counter",
      metaTitle: "Character Counter Online — Free Online Tool | DevBolt",
      metaDescription:
        "Count characters, words, and spaces in real time. Free client-side character counter with no signup — perfect for tweets, bios, and meta descriptions.",
      h1: "Character Counter Online",
      intro:
        "Count characters in real time as you type or paste text. This tool runs entirely in your browser — your content is never uploaded or stored anywhere.",
      content: [
        {
          heading: "What is a character counter?",
          body: "A character counter tallies the number of individual characters in a piece of text, including letters, numbers, punctuation, and optionally spaces. It is essential for platforms with strict character limits such as Twitter/X (280 chars), Instagram bios (150 chars), Google Ads headlines (30 chars), and HTML meta descriptions (155-160 chars).",
        },
        {
          heading: "Common use cases",
          body: "Social media managers use character counters to craft posts that fit within platform limits. SEO specialists check meta title and description lengths. Developers validate input field constraints. Students ensure essays and abstracts meet word and character requirements imposed by academic institutions.",
        },
      ],
      faqs: [
        {
          question: "Does the character count include spaces?",
          answer:
            "The tool shows both counts: characters with spaces and characters without spaces. This lets you quickly check against limits that count spaces (like Twitter) and those that don't.",
        },
        {
          question: "What is the character limit for a tweet?",
          answer:
            "Twitter/X allows up to 280 characters per tweet for standard accounts. URLs count as 23 characters regardless of their actual length due to t.co link shortening.",
        },
      ],
      keywords: [
        "character counter",
        "character count online",
        "letter counter",
        "count characters in text",
        "character counter tool",
      ],
      parentToolSlug: "word-counter",
      parentToolName: "Word & Character Counter",
    },
    {
      slug: "reading-time-calculator",
      title: "Reading Time Calculator",
      metaTitle: "Reading Time Calculator — Free Online Tool | DevBolt",
      metaDescription:
        "Estimate reading time for any text based on word count and average reading speed. Free, instant, and runs entirely in your browser.",
      h1: "Reading Time Calculator",
      intro:
        "Paste any text to get an instant reading time estimate based on average reading speed. All calculations happen client-side — your content stays private.",
      content: [
        {
          heading: "How is reading time calculated?",
          body: "Reading time is estimated by dividing the total word count by the average adult reading speed, typically 200-250 words per minute for English text. This tool uses 238 WPM as its default, which is the commonly cited average from research studies. Technical content with code or data may take longer, while familiar content may be faster.",
        },
        {
          heading: "Common use cases",
          body: "Bloggers display estimated reading times to set reader expectations and improve engagement. Content strategists use reading time to plan article lengths for different audiences. Newsletter writers ensure emails are short enough to be read during a commute. Course creators estimate lesson duration for video script text.",
        },
      ],
      faqs: [
        {
          question: "What reading speed does the calculator use?",
          answer:
            "The default speed is 238 words per minute, which is the widely cited average adult reading speed for English. You can adjust this to match your audience — technical readers may be slower, while speed readers can exceed 400 WPM.",
        },
        {
          question: "Does reading time affect SEO?",
          answer:
            "Displaying reading time can improve click-through rates and user engagement, which indirectly benefits SEO. Studies show readers are more likely to start an article when they know the time commitment upfront.",
        },
      ],
      keywords: [
        "reading time calculator",
        "estimate reading time",
        "words per minute calculator",
        "blog reading time",
        "how long to read",
      ],
      parentToolSlug: "word-counter",
      parentToolName: "Word & Character Counter",
    },
  ],

  "url-parser": [
    {
      slug: "query-string-parser",
      title: "Query String Parser",
      metaTitle: "Query String Parser Online — Free Online Tool | DevBolt",
      metaDescription:
        "Parse URL query strings into key-value pairs instantly. Free client-side query string decoder with support for arrays and encoded characters.",
      h1: "Query String Parser Online",
      intro:
        "Paste a URL or query string and instantly see every parameter broken down into key-value pairs. This tool runs client-side — no data is sent to any server.",
      content: [
        {
          heading: "What is a query string?",
          body: "A query string is the portion of a URL that follows the question mark (?). It contains key-value pairs separated by ampersands (&), such as ?page=2&sort=name&order=asc. Query strings pass data to web servers, configure page state, and carry tracking parameters like UTM codes for analytics.",
        },
        {
          heading: "Common use cases",
          body: "Developers parse query strings when debugging API requests, analyzing tracking parameters in marketing URLs, extracting search filters from browser address bars, and migrating URL structures during site redesigns. The parser handles URL-encoded characters (%20 for spaces), array parameters (key[]=value), and duplicate keys automatically.",
        },
      ],
      faqs: [
        {
          question: "How are special characters handled in query strings?",
          answer:
            "Special characters are percent-encoded in query strings (e.g., space becomes %20 or +, & becomes %26). The parser automatically decodes these so you see the original values.",
        },
        {
          question: "Can query strings contain arrays?",
          answer:
            "Yes. Common patterns include repeated keys (color=red&color=blue), bracket notation (color[]=red&color[]=blue), and indexed brackets (color[0]=red&color[1]=blue). The parser recognizes all of these formats.",
        },
      ],
      keywords: [
        "query string parser",
        "parse url parameters",
        "url query string decoder",
        "extract url parameters",
        "query parameter parser",
      ],
      parentToolSlug: "url-parser",
      parentToolName: "URL Parser",
    },
    {
      slug: "url-components",
      title: "URL Components Breakdown",
      metaTitle: "URL Components Breakdown Tool — Free Online Tool | DevBolt",
      metaDescription:
        "Break any URL into its components: protocol, host, port, path, query, and fragment. Free browser-based URL anatomy tool.",
      h1: "URL Components Breakdown Tool",
      intro:
        "Enter any URL and see it decomposed into every component — protocol, host, port, path, query parameters, and fragment. Everything is processed client-side in your browser.",
      content: [
        {
          heading: "What are URL components?",
          body: "A URL (Uniform Resource Locator) consists of several parts defined by RFC 3986: the scheme (https), authority (user@host:port), path (/page), query (?key=value), and fragment (#section). Understanding these components is essential for web development, security auditing, and SEO. Each part serves a distinct purpose in how browsers and servers locate and deliver resources.",
        },
        {
          heading: "Common use cases",
          body: "Developers break down URLs to debug routing issues, verify redirect targets, inspect deep-link structures in mobile apps, and validate canonical URLs for SEO. Security engineers analyze URLs to detect phishing attempts with misleading subdomains or encoded characters. The tool is also helpful when constructing URLs programmatically in REST clients or automation scripts.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between a URL and a URI?",
          answer:
            "A URL is a specific type of URI (Uniform Resource Identifier) that includes the access mechanism (like https://). All URLs are URIs, but not all URIs are URLs — a URN (like isbn:0451450523) is a URI that is not a URL.",
        },
        {
          question: "What is the fragment in a URL?",
          answer:
            "The fragment (the part after #) identifies a specific section within a page. It is processed by the browser only and never sent to the server. Single-page applications often use fragments for client-side routing.",
        },
      ],
      keywords: [
        "url components",
        "url anatomy",
        "url breakdown tool",
        "parse url parts",
        "url structure explained",
      ],
      parentToolSlug: "url-parser",
      parentToolName: "URL Parser",
    },
  ],

  "chmod-calculator": [
    {
      slug: "chmod-symbolic",
      title: "Chmod Symbolic Notation Guide",
      metaTitle: "Chmod Symbolic Notation Guide — Free Online Tool | DevBolt",
      metaDescription:
        "Learn chmod symbolic notation with interactive examples. Convert between symbolic (rwx) and octal permissions in your browser.",
      h1: "Chmod Symbolic Notation Guide",
      intro:
        "Understand chmod symbolic notation (rwx) with interactive conversion. This tool processes everything client-side — no commands are executed on any server.",
      content: [
        {
          heading: "What is chmod symbolic notation?",
          body: "Chmod symbolic notation uses letters to represent permissions: r (read), w (write), and x (execute). Permissions are grouped into three categories: u (user/owner), g (group), and o (others). Symbolic commands like u+x (add execute for owner) or go-w (remove write for group and others) are often easier to read than their octal equivalents.",
        },
        {
          heading: "Common use cases",
          body: "System administrators use symbolic chmod to make scripts executable (chmod u+x script.sh), restrict sensitive config files (chmod go-rwx .env), or set group-writable directories for shared projects (chmod g+w /var/www). Symbolic notation is preferred in documentation and automation because it clearly communicates intent without requiring mental octal math.",
        },
      ],
      faqs: [
        {
          question: "What does chmod u+x mean?",
          answer:
            "chmod u+x adds execute permission for the file owner (u = user). After running this, the owner can execute the file as a program or script while other permissions remain unchanged.",
        },
        {
          question: "What is the difference between symbolic and octal chmod?",
          answer:
            "Symbolic notation uses letters (u+rwx, g-w, o=r) to add, remove, or set specific permissions. Octal notation uses numbers (755, 644) to set all permissions at once. Symbolic is better for incremental changes; octal is better for setting exact states.",
        },
      ],
      keywords: [
        "chmod symbolic notation",
        "chmod rwx explained",
        "symbolic chmod guide",
        "chmod u+x meaning",
        "linux file permissions symbolic",
      ],
      parentToolSlug: "chmod-calculator",
      parentToolName: "Chmod Calculator",
    },
    {
      slug: "chmod-octal",
      title: "Chmod Octal Calculator",
      metaTitle: "Chmod Octal Calculator Online — Free Online Tool | DevBolt",
      metaDescription:
        "Calculate chmod octal values interactively. Convert between octal numbers (755, 644) and rwx permissions instantly in your browser.",
      h1: "Chmod Octal Calculator Online",
      intro:
        "Toggle permission checkboxes and see the corresponding octal value update in real time. This calculator runs entirely in your browser with no server interaction.",
      content: [
        {
          heading: "What is chmod octal notation?",
          body: "Chmod octal notation uses three digits (e.g., 755) to represent file permissions. Each digit is the sum of permission values: read (4), write (2), and execute (1). The first digit is the owner, the second is the group, and the third is others. So 755 means the owner can read, write, and execute (7), while group and others can read and execute (5).",
        },
        {
          heading: "Common use cases",
          body: "The most common octal values are 644 (owner read-write, everyone else read-only — typical for files), 755 (owner full, everyone else read-execute — typical for directories and scripts), and 600 (owner read-write only — typical for SSH keys and secrets). Knowing these by heart saves time in daily server administration.",
        },
      ],
      faqs: [
        {
          question: "What does chmod 777 mean?",
          answer:
            "chmod 777 grants read, write, and execute permissions to everyone — owner, group, and others. This is generally considered a security risk and should be avoided in production. Use more restrictive permissions like 755 or 644 instead.",
        },
        {
          question: "What chmod should I use for SSH keys?",
          answer:
            "SSH private keys should be chmod 600 (read-write for owner only). SSH will refuse to use a key file with permissions that are too open. The .ssh directory itself should be 700.",
        },
      ],
      keywords: [
        "chmod octal calculator",
        "chmod 755 meaning",
        "chmod 644 meaning",
        "octal permission calculator",
        "linux chmod number calculator",
      ],
      parentToolSlug: "chmod-calculator",
      parentToolName: "Chmod Calculator",
    },
  ],

  "subnet-calculator": [
    {
      slug: "cidr-calculator",
      title: "CIDR Calculator",
      metaTitle: "CIDR Calculator Online — Free Online Tool | DevBolt",
      metaDescription:
        "Calculate CIDR ranges, subnet masks, host counts, and broadcast addresses instantly. Free browser-based CIDR notation calculator.",
      h1: "CIDR Calculator Online",
      intro:
        "Enter a CIDR block (e.g., 192.168.1.0/24) and instantly see the network address, broadcast address, subnet mask, and total host count. All calculations happen in your browser.",
      content: [
        {
          heading: "What is CIDR notation?",
          body: "CIDR (Classless Inter-Domain Routing) notation represents IP address ranges using a base address and prefix length, such as 10.0.0.0/8. The prefix length indicates how many leading bits define the network portion. CIDR replaced the old classful addressing system (Class A, B, C) in 1993, enabling more efficient allocation of IP address space and smaller routing tables.",
        },
        {
          heading: "Common use cases",
          body: "Network engineers use CIDR calculators to plan subnets for cloud VPCs (AWS, Azure, GCP), configure firewall rules, set up VPN tunnels, and design office network layouts. DevOps teams reference CIDR blocks when writing security group rules, Kubernetes network policies, and infrastructure-as-code definitions in Terraform or CloudFormation.",
        },
      ],
      faqs: [
        {
          question: "How many hosts are in a /24 network?",
          answer:
            "A /24 network has 256 total IP addresses (2^8). Subtracting the network address and broadcast address leaves 254 usable host addresses. This is the most common subnet size for small LANs.",
        },
        {
          question: "What is the difference between CIDR and a subnet mask?",
          answer:
            "They represent the same information in different formats. CIDR notation /24 is equivalent to the subnet mask 255.255.255.0. CIDR is more compact and commonly used in modern networking, routing tables, and cloud configurations.",
        },
      ],
      keywords: [
        "cidr calculator",
        "cidr notation calculator",
        "cidr to subnet mask",
        "ip cidr calculator",
        "network cidr calculator",
      ],
      parentToolSlug: "subnet-calculator",
      parentToolName: "IP / CIDR Toolkit",
    },
    {
      slug: "vlsm-calculator",
      title: "VLSM Subnet Calculator",
      metaTitle: "VLSM Subnet Calculator Online — Free Online Tool | DevBolt",
      metaDescription:
        "Calculate variable-length subnet masks to efficiently divide IP space. Free VLSM calculator for network planning — runs in your browser.",
      h1: "VLSM Subnet Calculator Online",
      intro:
        "Plan variable-length subnets by specifying host requirements for each segment. The calculator optimally divides your address space — all processing happens client-side.",
      content: [
        {
          heading: "What is VLSM?",
          body: "VLSM (Variable Length Subnet Masking) allows different subnets within the same network to use different prefix lengths. Unlike fixed-length subnetting where every subnet is the same size, VLSM lets you allocate a /28 (14 hosts) for a small office and a /22 (1,022 hosts) for a data center floor — all from the same address block. This minimizes IP address waste.",
        },
        {
          heading: "Common use cases",
          body: "Network architects use VLSM when designing enterprise networks with segments of varying sizes — server rooms, employee floors, IoT subnets, and point-to-point WAN links. CCNA and CCNP candidates practice VLSM calculations extensively. Cloud engineers apply VLSM principles when subdividing VPC address space across multiple availability zones and workload types.",
        },
      ],
      faqs: [
        {
          question: "How does VLSM differ from fixed-length subnetting?",
          answer:
            "Fixed-length subnetting divides a network into equal-sized subnets, wasting addresses when segments vary in size. VLSM assigns different prefix lengths to each subnet based on actual host requirements, making much more efficient use of the address space.",
        },
        {
          question: "What routing protocols support VLSM?",
          answer:
            "Classless routing protocols — OSPF, EIGRP, BGP, IS-IS, and RIPv2 — all support VLSM by including the subnet mask in routing updates. Classful protocols like RIPv1 do not support VLSM.",
        },
      ],
      keywords: [
        "vlsm calculator",
        "vlsm subnet calculator",
        "variable length subnet mask",
        "vlsm subnetting",
        "vlsm network design",
      ],
      parentToolSlug: "subnet-calculator",
      parentToolName: "IP / CIDR Toolkit",
    },
  ],

  "docker-compose": [
    {
      slug: "docker-compose-examples",
      title: "Docker Compose File Examples",
      metaTitle: "Docker Compose File Examples — Free Online Tool | DevBolt",
      metaDescription:
        "Browse ready-to-use Docker Compose examples for popular stacks: NGINX, PostgreSQL, Redis, Node.js, and more. Validate and edit in your browser.",
      h1: "Docker Compose File Examples",
      intro:
        "Explore curated Docker Compose examples for common stacks and services. Edit and validate them directly in your browser — no Docker installation required.",
      content: [
        {
          heading: "Why use Docker Compose examples?",
          body: "Starting from a working example is faster and less error-prone than writing a docker-compose.yml from scratch. Examples demonstrate best practices like health checks, restart policies, named volumes, and proper networking. They also show correct YAML indentation and key ordering, which are common sources of frustration for newcomers.",
        },
        {
          heading: "Common use cases",
          body: "Developers use Compose examples to spin up local development environments with databases and caches, prototype microservice architectures, create reproducible CI/CD test environments, and onboard new team members with a single docker compose up command. The examples cover stacks like NGINX + Node.js, PostgreSQL + pgAdmin, Redis, Elasticsearch, and WordPress.",
        },
      ],
      faqs: [
        {
          question: "Which Docker Compose version should I use?",
          answer:
            "Docker Compose V2 (the docker compose plugin) is the current standard. The version key in docker-compose.yml is now optional and ignored by Compose V2. If you're starting a new project, omit the version field entirely.",
        },
        {
          question: "Can I validate a Docker Compose file without running it?",
          answer:
            "Yes. You can use the docker compose config command locally, or paste your YAML into DevBolt's Docker Compose Validator to check syntax and structure without needing Docker installed.",
        },
      ],
      keywords: [
        "docker compose examples",
        "docker compose file examples",
        "docker compose yaml examples",
        "docker compose templates",
        "docker compose sample files",
      ],
      parentToolSlug: "docker-compose",
      parentToolName: "Docker Compose Validator",
    },
    {
      slug: "docker-compose-reference",
      title: "Docker Compose Syntax Reference",
      metaTitle: "Docker Compose Syntax Reference — Free Online Tool | DevBolt",
      metaDescription:
        "Complete Docker Compose syntax reference covering services, volumes, networks, and deploy options. Validate your YAML live in the browser.",
      h1: "Docker Compose Syntax Reference",
      intro:
        "Learn every key in the Docker Compose specification with clear explanations. Test your configurations live in the browser — no Docker installation needed.",
      content: [
        {
          heading: "Docker Compose file structure",
          body: "A Docker Compose file defines services (containers), networks, volumes, and optionally configs and secrets. Each service specifies an image or build context, port mappings, environment variables, volume mounts, and dependencies. The file uses YAML syntax, so proper indentation with spaces (not tabs) is critical.",
        },
        {
          heading: "Common use cases",
          body: "Developers reference the Compose specification when adding health checks to services, configuring resource limits for staging environments, setting up inter-service networking, managing persistent storage with named volumes, and implementing graceful shutdown with stop_signal and stop_grace_period. The reference is invaluable when migrating from Compose V1 to V2 syntax.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between Compose V1 and V2?",
          answer:
            "Compose V2 is a Docker CLI plugin (docker compose) replacing the standalone Python-based V1 (docker-compose). V2 uses the Compose Specification, supports GPU resources, profiles, and service dependencies with conditions. The version key is deprecated in V2.",
        },
        {
          question: "How do I set environment variables in Docker Compose?",
          answer:
            "Use the environment key for inline variables, env_file to load from a .env file, or combine both. Variables in .env files at the project root are automatically interpolated in the YAML using ${VARIABLE} syntax.",
        },
      ],
      keywords: [
        "docker compose reference",
        "docker compose syntax",
        "docker compose specification",
        "docker compose yaml reference",
        "docker compose keys explained",
      ],
      parentToolSlug: "docker-compose",
      parentToolName: "Docker Compose Validator",
    },
  ],

  "cron-parser": [
    {
      slug: "cron-syntax",
      title: "Cron Expression Syntax Guide",
      metaTitle: "Cron Expression Syntax Guide — Free Online Tool | DevBolt",
      metaDescription:
        "Learn cron expression syntax: fields, wildcards, ranges, and step values explained clearly. Test cron expressions live in your browser.",
      h1: "Cron Expression Syntax Guide",
      intro:
        "Master cron expression syntax with clear explanations of every field and operator. Test expressions live in your browser — no crontab access required.",
      content: [
        {
          heading: "What is a cron expression?",
          body: "A cron expression is a string of five (or six) fields that defines a recurring schedule. The standard five fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-7, where 0 and 7 are Sunday). Special characters include * (any value), , (list), - (range), and / (step). For example, */15 * * * * runs every 15 minutes.",
        },
        {
          heading: "Common use cases",
          body: "Cron expressions schedule automated backups, log rotation, report generation, database maintenance, email digests, and deployment pipelines. They are used in Unix crontab, Kubernetes CronJobs, GitHub Actions, AWS EventBridge, and CI/CD platforms. Understanding the syntax is essential for any developer working with scheduled automation.",
        },
      ],
      faqs: [
        {
          question: "What does the asterisk (*) mean in a cron expression?",
          answer:
            "The asterisk means 'every possible value' for that field. For example, * in the hour field means every hour. Combined with other fields, * * * * * runs every minute of every hour of every day.",
        },
        {
          question: "How do I run a cron job every 5 minutes?",
          answer:
            "Use the expression */5 * * * *. The /5 is a step value meaning 'every 5th minute.' This is equivalent to writing 0,5,10,15,20,25,30,35,40,45,50,55 in the minute field.",
        },
      ],
      keywords: [
        "cron expression syntax",
        "cron syntax guide",
        "crontab syntax",
        "cron fields explained",
        "cron special characters",
      ],
      parentToolSlug: "cron-parser",
      parentToolName: "Cron Expression Parser",
    },
    {
      slug: "cron-examples",
      title: "Cron Expression Examples",
      metaTitle: "Cron Expression Examples — Free Online Tool | DevBolt",
      metaDescription:
        "Copy-paste cron expression examples for common schedules: daily, weekly, hourly, monthly, and custom intervals. Test each one live.",
      h1: "Cron Expression Examples",
      intro:
        "Browse ready-to-use cron expressions for common scheduling patterns. Test any expression instantly in your browser to verify the next run times.",
      content: [
        {
          heading: "Why use cron expression examples?",
          body: "Even experienced developers second-guess cron syntax. Is 0 3 * * 1 Monday at 3 AM or January at 3 AM? Starting from a verified example eliminates guesswork. Each example below shows the expression, a plain-English description, and the next several run times so you can confirm it does what you expect.",
        },
        {
          heading: "Common scheduling patterns",
          body: "The most requested cron schedules are: every minute (*/1 * * * *), every hour on the hour (0 * * * *), daily at midnight (0 0 * * *), every weekday at 9 AM (0 9 * * 1-5), weekly on Sunday (0 0 * * 0), first of every month (0 0 1 * *), and quarterly (0 0 1 1,4,7,10 *). These cover the vast majority of automation use cases.",
        },
      ],
      faqs: [
        {
          question: "What cron expression runs every day at midnight?",
          answer:
            "The expression 0 0 * * * runs at 00:00 (midnight) every day. The first 0 is the minute, the second 0 is the hour, and the three asterisks mean every day, every month, every day of the week.",
        },
        {
          question: "How do I run a cron job on weekdays only?",
          answer:
            "Use 1-5 in the day-of-week field. For example, 0 9 * * 1-5 runs at 9 AM Monday through Friday. Day 1 is Monday and day 5 is Friday in most cron implementations.",
        },
      ],
      keywords: [
        "cron expression examples",
        "crontab examples",
        "cron schedule examples",
        "common cron expressions",
        "cron job examples",
      ],
      parentToolSlug: "cron-parser",
      parentToolName: "Cron Expression Parser",
    },
  ],

  "cron-generator": [
    {
      slug: "daily-cron",
      title: "Daily Cron Job Generator",
      metaTitle: "Daily Cron Job Generator — Free Online Tool | DevBolt",
      metaDescription:
        "Generate cron expressions for daily schedules with custom times. Free browser-based cron generator — no crontab access needed.",
      h1: "Daily Cron Job Generator",
      intro:
        "Build cron expressions for daily tasks by selecting your preferred time. The generator runs in your browser — no server-side processing or crontab access required.",
      content: [
        {
          heading: "What is a daily cron job?",
          body: "A daily cron job is a scheduled task that runs once every day at a specified time. The basic pattern is 0 H * * * where H is the hour (0-23). For example, 0 3 * * * runs at 3:00 AM daily. You can also specify a minute for more precision, like 30 2 * * * for 2:30 AM every day.",
        },
        {
          heading: "Common use cases",
          body: "Daily cron jobs are used for database backups at off-peak hours, sending daily digest emails, generating overnight reports, cleaning temporary files, rotating logs, refreshing caches, and syncing data between systems. Scheduling during low-traffic periods (typically 2-5 AM local time) minimizes impact on production workloads.",
        },
      ],
      faqs: [
        {
          question: "What time zone does a cron job use?",
          answer:
            "Standard cron uses the system's local time zone. In Kubernetes CronJobs, you can set the time zone with the timeZone field (since v1.27). Cloud services like AWS EventBridge let you specify a time zone per rule.",
        },
        {
          question: "Can I run a daily cron job at multiple times?",
          answer:
            "Yes. Use a comma-separated list in the hour field. For example, 0 8,20 * * * runs at 8 AM and 8 PM daily. You can list as many hours as needed.",
        },
      ],
      keywords: [
        "daily cron job",
        "daily cron expression",
        "cron every day",
        "cron daily schedule",
        "generate daily cron",
      ],
      parentToolSlug: "cron-generator",
      parentToolName: "Crontab Generator",
    },
    {
      slug: "weekly-cron",
      title: "Weekly Cron Job Generator",
      metaTitle: "Weekly Cron Job Generator — Free Online Tool | DevBolt",
      metaDescription:
        "Generate cron expressions for weekly schedules with custom day and time selection. Free client-side cron generator tool.",
      h1: "Weekly Cron Job Generator",
      intro:
        "Create cron expressions for weekly tasks by picking the day of the week and time. Everything runs in your browser — no server or crontab access needed.",
      content: [
        {
          heading: "What is a weekly cron job?",
          body: "A weekly cron job runs once per week on a specific day at a specific time. The pattern is M H * * D where M is minutes, H is hours, and D is the day of the week (0=Sunday, 1=Monday, ... 6=Saturday). For example, 0 9 * * 1 runs every Monday at 9:00 AM.",
        },
        {
          heading: "Common use cases",
          body: "Weekly cron jobs are ideal for generating weekly reports, sending newsletter digests, running full database optimizations, performing security scans, cleaning up archived data, and triggering CI/CD pipeline health checks. Teams often schedule maintenance windows on weekends using expressions like 0 2 * * 6 (Saturday at 2 AM).",
        },
      ],
      faqs: [
        {
          question: "How do I set a cron job for every Monday?",
          answer:
            "Use 1 in the day-of-week field. For example, 0 9 * * 1 runs every Monday at 9:00 AM. In most cron implementations, Monday is day 1 and Sunday is day 0 (or 7).",
        },
        {
          question: "Can I schedule a cron job for multiple days per week?",
          answer:
            "Yes. Use a comma-separated list in the day-of-week field. For example, 0 10 * * 1,3,5 runs at 10 AM on Monday, Wednesday, and Friday. You can also use a range like 1-5 for weekdays.",
        },
      ],
      keywords: [
        "weekly cron job",
        "weekly cron expression",
        "cron every week",
        "cron weekly schedule",
        "generate weekly cron",
      ],
      parentToolSlug: "cron-generator",
      parentToolName: "Crontab Generator",
    },
  ],

  "image-compressor": [
    {
      slug: "compress-jpeg",
      title: "JPEG Compressor",
      metaTitle: "JPEG Compressor Online — Free Online Tool | DevBolt",
      metaDescription:
        "Compress JPEG images in your browser with adjustable quality. No upload to any server — your photos stay completely private and secure.",
      h1: "JPEG Compressor Online",
      intro:
        "Reduce JPEG file sizes by adjusting quality settings. All compression happens in your browser using the Canvas API — no images are uploaded to any server.",
      content: [
        {
          heading: "How does JPEG compression work?",
          body: "JPEG uses lossy compression based on the Discrete Cosine Transform (DCT). It divides the image into 8x8 pixel blocks, converts them to frequency domain, and discards high-frequency detail that the human eye is less sensitive to. Lower quality settings discard more data, producing smaller files with visible artifacts. Quality levels of 70-85% typically provide the best balance between file size and visual quality.",
        },
        {
          heading: "Common use cases",
          body: "Web developers compress JPEGs to improve page load times and Core Web Vitals scores. Photographers reduce file sizes for email sharing and web galleries. E-commerce sites batch-compress product images to keep pages fast. Bloggers optimize hero images that are often the heaviest assets on a page.",
        },
      ],
      faqs: [
        {
          question: "What JPEG quality should I use for the web?",
          answer:
            "A quality setting of 75-85% typically reduces file size by 50-70% with minimal visible loss. For hero images, use 80-85%. For thumbnails and background images, 60-70% is usually sufficient.",
        },
        {
          question: "Does JPEG compression remove EXIF data?",
          answer:
            "Browser-based JPEG re-encoding through the Canvas API strips EXIF metadata (camera model, GPS, settings) by default. This can be a privacy benefit when sharing photos online.",
        },
      ],
      keywords: [
        "jpeg compressor",
        "compress jpeg online",
        "jpeg image compression",
        "reduce jpeg file size",
        "jpeg optimizer",
      ],
      parentToolSlug: "image-compressor",
      parentToolName: "Image Compressor",
    },
    {
      slug: "compress-png",
      title: "PNG Compressor",
      metaTitle: "PNG Compressor Online — Free Online Tool | DevBolt",
      metaDescription:
        "Compress PNG images in your browser without losing quality. Free client-side PNG optimizer — no files uploaded to any server.",
      h1: "PNG Compressor Online",
      intro:
        "Reduce PNG file sizes while preserving transparency and sharp edges. All optimization runs in your browser — no images are uploaded anywhere.",
      content: [
        {
          heading: "How does PNG compression work?",
          body: "PNG uses lossless compression (DEFLATE), meaning no pixel data is lost. Optimization reduces file size by choosing better filter strategies, removing unnecessary metadata chunks (like timestamps and text), and reducing the color palette when possible. For images with fewer than 256 colors, converting from truecolor to indexed (PNG-8) can cut file sizes dramatically.",
        },
        {
          heading: "Common use cases",
          body: "PNG compression is essential for screenshots, UI elements, logos, icons, and any graphic requiring transparency. Web developers optimize PNGs to improve Lighthouse performance scores. Designers compress assets before handing off to development. App developers reduce bundle sizes by optimizing embedded image resources.",
        },
      ],
      faqs: [
        {
          question: "Is PNG compression lossless?",
          answer:
            "Standard PNG optimization is lossless — every pixel remains identical. Lossy PNG compression (color palette reduction) can achieve much smaller files with minimal visual difference, especially for images with limited colors.",
        },
        {
          question: "When should I use PNG instead of JPEG?",
          answer:
            "Use PNG for images with transparency, sharp text, line art, screenshots, and graphics with flat colors. Use JPEG for photographs and complex images where slight quality loss is acceptable in exchange for much smaller file sizes.",
        },
      ],
      keywords: [
        "png compressor",
        "compress png online",
        "png image optimization",
        "reduce png file size",
        "png optimizer",
      ],
      parentToolSlug: "image-compressor",
      parentToolName: "Image Compressor",
    },
    {
      slug: "compress-webp",
      title: "WebP Converter & Compressor",
      metaTitle: "WebP Converter & Compressor — Free Online Tool | DevBolt",
      metaDescription:
        "Convert and compress images to WebP format in your browser. Achieve 25-35% smaller files than JPEG with no server upload required.",
      h1: "WebP Converter & Compressor",
      intro:
        "Convert JPEG or PNG images to WebP for significantly smaller file sizes. All conversion happens client-side — your images never leave your device.",
      content: [
        {
          heading: "What is WebP?",
          body: "WebP is a modern image format developed by Google that provides both lossy and lossless compression. Lossy WebP is typically 25-35% smaller than equivalent-quality JPEG, while lossless WebP is about 26% smaller than PNG. WebP also supports transparency (alpha channel) and animation, making it a versatile replacement for JPEG, PNG, and GIF on the web.",
        },
        {
          heading: "Common use cases",
          body: "Web developers serve WebP images to improve page load speed and Core Web Vitals, often using <picture> elements with JPEG/PNG fallbacks. Content management systems auto-convert uploaded images to WebP. E-commerce platforms use WebP for product catalogs to reduce bandwidth costs. All modern browsers — Chrome, Firefox, Safari, and Edge — support WebP.",
        },
      ],
      faqs: [
        {
          question: "Do all browsers support WebP?",
          answer:
            "Yes, as of 2023 all major browsers support WebP: Chrome (since 2014), Firefox (since 2019), Safari (since 2020/macOS Big Sur), and Edge. The only holdout was older Safari/iOS versions, which is no longer a significant concern.",
        },
        {
          question: "How much smaller is WebP compared to JPEG?",
          answer:
            "Lossy WebP files are typically 25-35% smaller than JPEG at equivalent visual quality. The savings vary by image content — photos with fine detail see the largest reductions. Lossless WebP is about 26% smaller than PNG.",
        },
      ],
      keywords: [
        "webp converter",
        "convert to webp",
        "webp compressor",
        "jpeg to webp",
        "png to webp online",
      ],
      parentToolSlug: "image-compressor",
      parentToolName: "Image Compressor",
    },
  ],

  "svg-optimizer": [
    {
      slug: "svg-minifier",
      title: "SVG Minifier",
      metaTitle: "SVG Minifier Online — Free Online Tool | DevBolt",
      metaDescription:
        "Minify SVG files by removing comments, metadata, and unnecessary attributes. Free client-side SVG optimizer — no files uploaded.",
      h1: "SVG Minifier Online",
      intro:
        "Paste SVG code and instantly get a minified version with unnecessary data stripped out. Everything runs in your browser — no files are uploaded to any server.",
      content: [
        {
          heading: "What does SVG minification do?",
          body: "SVG minification removes elements that don't affect rendering: XML comments, editor metadata (from Illustrator, Figma, Inkscape), empty groups, default attribute values, unnecessary whitespace, and redundant namespace declarations. This typically reduces SVG file size by 20-60% without changing the visual output. Minified SVGs load faster and reduce page weight.",
        },
        {
          heading: "Common use cases",
          body: "Front-end developers minify SVGs before inlining them in HTML or React components. Design systems optimize icon libraries to minimize bundle sizes. Email developers reduce SVG size to stay within email client limits. Build pipelines run SVG minification as part of asset optimization alongside CSS and JavaScript minification.",
        },
      ],
      faqs: [
        {
          question: "Does SVG minification change how the image looks?",
          answer:
            "No. SVG minification only removes non-visual data like comments, metadata, and redundant attributes. The rendered output is visually identical. Precision reduction on coordinates may cause sub-pixel shifts, but these are imperceptible.",
        },
        {
          question: "How much can SVG minification reduce file size?",
          answer:
            "Typical reductions range from 20-60% depending on the source. SVGs exported from design tools like Illustrator or Figma often contain significant metadata and editor-specific attributes, leading to larger savings after minification.",
        },
      ],
      keywords: [
        "svg minifier",
        "minify svg online",
        "svg optimizer",
        "compress svg",
        "reduce svg file size",
      ],
      parentToolSlug: "svg-optimizer",
      parentToolName: "SVG Optimizer",
    },
    {
      slug: "svg-viewer",
      title: "SVG Viewer & Inspector",
      metaTitle: "SVG Viewer & Inspector Online — Free Online Tool | DevBolt",
      metaDescription:
        "View and inspect SVG files in your browser. See rendered output, source code, dimensions, and element structure — no upload required.",
      h1: "SVG Viewer & Inspector Online",
      intro:
        "Paste SVG code or load a file to see the rendered preview alongside the source. Inspect dimensions, viewBox, and element structure — all client-side.",
      content: [
        {
          heading: "What is an SVG viewer?",
          body: "An SVG viewer renders Scalable Vector Graphics in the browser and lets you inspect the underlying XML structure. Unlike raster images, SVGs are code — each shape, path, and text element is a node you can examine. A good viewer shows the rendered output, source code, dimensions, viewBox settings, and total element count side by side.",
        },
        {
          heading: "Common use cases",
          body: "Designers use SVG viewers to verify exports from Figma, Sketch, or Illustrator render correctly before handing off to developers. Developers inspect SVG structure to identify redundant groups or find specific path IDs for CSS animations. QA engineers verify icon sets display at multiple sizes. The viewer also helps debug viewBox and aspect ratio issues.",
        },
      ],
      faqs: [
        {
          question: "What is the SVG viewBox attribute?",
          answer:
            "The viewBox defines the coordinate system and aspect ratio of the SVG canvas. It takes four values: min-x, min-y, width, and height. A properly set viewBox allows the SVG to scale responsively to any container size without distortion.",
        },
        {
          question: "Can I edit SVG code in the viewer?",
          answer:
            "Yes. You can modify the SVG source code directly and see the rendered output update in real time. This is useful for tweaking colors, adjusting paths, or removing unwanted elements without switching to a design tool.",
        },
      ],
      keywords: [
        "svg viewer",
        "svg inspector",
        "view svg online",
        "svg preview tool",
        "svg code viewer",
      ],
      parentToolSlug: "svg-optimizer",
      parentToolName: "SVG Optimizer",
    },
  ],

  "slug-generator": [
    {
      slug: "url-slug-generator",
      title: "URL Slug Generator for SEO",
      metaTitle: "URL Slug Generator for SEO — Free Online Tool | DevBolt",
      metaDescription:
        "Generate clean, SEO-friendly URL slugs from any text. Handles Unicode, special characters, and stop words — runs entirely in your browser.",
      h1: "URL Slug Generator for SEO",
      intro:
        "Convert any title or phrase into a clean, SEO-optimized URL slug. The generator handles special characters and Unicode — all processing happens client-side.",
      content: [
        {
          heading: "What is a URL slug?",
          body: "A URL slug is the human-readable portion of a URL that identifies a specific page, such as /blog/how-to-optimize-images in https://example.com/blog/how-to-optimize-images. Good slugs are lowercase, use hyphens to separate words, omit stop words (a, the, and), and include the target keyword. They help search engines understand page content and improve click-through rates in search results.",
        },
        {
          heading: "Common use cases",
          body: "Content management systems generate slugs from article titles when creating new posts. Developers build slug generation into admin panels and API endpoints. SEO specialists audit existing URLs and optimize slugs for target keywords. E-commerce teams create product URL slugs that include brand and product names for better search visibility.",
        },
      ],
      faqs: [
        {
          question: "Do URL slugs affect SEO?",
          answer:
            "Yes. Google considers words in the URL as a minor ranking signal. More importantly, descriptive slugs improve click-through rates because users can see what the page is about before clicking. Keep slugs short, keyword-rich, and readable.",
        },
        {
          question: "Should I remove stop words from URL slugs?",
          answer:
            "Generally yes. Removing words like 'a', 'the', 'and', 'of' keeps slugs shorter and more focused on keywords. Compare /the-best-guide-to-seo vs /best-seo-guide — the shorter version is cleaner and equally descriptive.",
        },
      ],
      keywords: [
        "url slug generator",
        "seo slug generator",
        "create url slug",
        "slug from title",
        "seo friendly url generator",
      ],
      parentToolSlug: "slug-generator",
      parentToolName: "URL Slug Generator",
    },
    {
      slug: "seo-url-generator",
      title: "SEO-Friendly URL Generator",
      metaTitle: "SEO-Friendly URL Generator — Free Online Tool | DevBolt",
      metaDescription:
        "Create SEO-optimized URLs with clean slugs, proper structure, and keyword placement. Free browser-based URL generator tool.",
      h1: "SEO-Friendly URL Generator",
      intro:
        "Turn any page title into a perfectly structured, SEO-friendly URL. All processing runs client-side in your browser — nothing is stored or transmitted.",
      content: [
        {
          heading: "What makes a URL SEO-friendly?",
          body: "An SEO-friendly URL is short (under 60 characters ideally), descriptive, lowercase, and uses hyphens as word separators. It includes the primary keyword near the beginning, avoids parameters and session IDs, and follows a logical site hierarchy. Google's guidelines recommend simple, human-readable URLs that convey the page's content at a glance.",
        },
        {
          heading: "Common use cases",
          body: "SEO teams use URL generators when planning site architecture and URL structures for new sections. Developers integrate URL generation logic into CMS platforms and headless content APIs. Content writers verify their proposed titles will produce clean URLs before publishing. Migration specialists map old dynamic URLs to new SEO-friendly patterns during site redesigns.",
        },
      ],
      faqs: [
        {
          question: "How long should an SEO-friendly URL be?",
          answer:
            "Aim for under 60 characters for the path portion. Google can index longer URLs, but shorter ones are easier to share, display better in search results, and tend to have higher click-through rates. Focus on 3-5 descriptive words.",
        },
        {
          question: "Should URLs use hyphens or underscores?",
          answer:
            "Use hyphens (-), not underscores (_). Google treats hyphens as word separators but treats underscores as word joiners. So /url-slug-generator is read as three words, while /url_slug_generator is read as one. This has been confirmed by Google engineers.",
        },
      ],
      keywords: [
        "seo friendly url",
        "seo url generator",
        "seo optimized url",
        "url structure for seo",
        "clean url generator",
      ],
      parentToolSlug: "slug-generator",
      parentToolName: "URL Slug Generator",
    },
  ],

  "json-diff": [
    {
      slug: "json-compare",
      title: "JSON Compare Tool",
      metaTitle: "JSON Compare Tool Online — Free Online Tool | DevBolt",
      metaDescription:
        "Compare two JSON objects and see every difference highlighted. Free client-side JSON comparison tool — your data never leaves your browser.",
      h1: "JSON Compare Tool Online",
      intro:
        "Paste two JSON objects and instantly see additions, deletions, and changes highlighted. All comparison runs client-side — your data stays completely private.",
      content: [
        {
          heading: "What is JSON comparison?",
          body: "JSON comparison analyzes two JSON documents and identifies structural and value differences. Unlike plain text diff, JSON comparison understands the data structure — it can detect that two objects are equivalent even if keys are in different orders, and it reports changes using JSON paths (e.g., 'user.address.city changed from X to Y') rather than line numbers.",
        },
        {
          heading: "Common use cases",
          body: "Developers compare API responses before and after code changes to verify no unintended modifications. QA engineers diff production vs staging API outputs. DevOps teams compare configuration files across environments. Data engineers validate ETL pipeline outputs by comparing expected and actual JSON payloads.",
        },
      ],
      faqs: [
        {
          question: "Does JSON comparison care about key order?",
          answer:
            "No. JSON objects are unordered by specification, so {\"a\":1,\"b\":2} and {\"b\":2,\"a\":1} are considered equal. The comparison focuses on structural and value differences, not formatting or key order.",
        },
        {
          question: "Can I compare large JSON files?",
          answer:
            "Yes. Since the tool runs in your browser, performance depends on your device's memory. It handles files up to several megabytes comfortably. For very large files, ensure your browser tab has enough available memory.",
        },
      ],
      keywords: [
        "json compare",
        "compare json online",
        "json comparison tool",
        "json diff compare",
        "compare two json objects",
      ],
      parentToolSlug: "json-diff",
      parentToolName: "JSON Diff",
    },
    {
      slug: "structural-diff",
      title: "JSON Structural Diff Viewer",
      metaTitle: "JSON Structural Diff Viewer — Free Online Tool | DevBolt",
      metaDescription:
        "View structural differences between JSON documents: added keys, removed keys, type changes, and nested modifications. Free and client-side.",
      h1: "JSON Structural Diff Viewer",
      intro:
        "Analyze structural changes between two JSON documents — added keys, removed keys, type changes, and modified values. All processing happens in your browser.",
      content: [
        {
          heading: "What is a structural JSON diff?",
          body: "A structural diff goes beyond line-by-line comparison to analyze the JSON tree. It categorizes changes as additions (new keys or array elements), deletions (removed keys), modifications (changed values), and type changes (e.g., string to number). Results are presented with full JSON paths, making it easy to locate each change in deeply nested structures.",
        },
        {
          heading: "Common use cases",
          body: "API developers use structural diffs to detect breaking changes between schema versions — a renamed key or changed type can break consumers even if the text diff looks minor. Configuration management teams diff Terraform state files to understand infrastructure changes. Database teams compare schema export snapshots to track DDL drift over time.",
        },
      ],
      faqs: [
        {
          question: "What counts as a structural change in JSON?",
          answer:
            "Structural changes include added or removed object keys, added or removed array elements, type changes (e.g., string to number), and changes in nesting depth. Value changes within the same type are reported as modifications rather than structural changes.",
        },
        {
          question: "How is a structural diff different from a text diff?",
          answer:
            "A text diff compares line by line and is affected by formatting, whitespace, and key order. A structural diff parses the JSON tree and compares nodes semantically, so reformatting or reordering keys does not produce false positives.",
        },
      ],
      keywords: [
        "json structural diff",
        "json tree diff",
        "json schema diff",
        "compare json structure",
        "json structural comparison",
      ],
      parentToolSlug: "json-diff",
      parentToolName: "JSON Diff",
    },
  ],
};
