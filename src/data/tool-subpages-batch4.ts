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

  "git-command-builder": [
    {
      slug: "git-merge-vs-rebase",
      title: "Git Merge vs Rebase",
      metaTitle: "Git Merge vs Rebase — When to Use Each | DevBolt",
      metaDescription:
        "Understand the difference between git merge and git rebase. Learn when to use each strategy with clear examples and visual explanations.",
      h1: "Git Merge vs Rebase — When to Use Each",
      intro:
        "Merge and rebase both integrate changes from one branch into another, but they work very differently. Use the command builder above to construct either command with the right flags.",
      content: [
        {
          heading: "How git merge works",
          body: "git merge creates a new merge commit that ties together the histories of two branches. The original branch history is preserved exactly as it happened. This is the safest option because it never rewrites history. Use --no-ff to always create a merge commit even when a fast-forward is possible.",
        },
        {
          heading: "How git rebase works",
          body: "git rebase replays your branch's commits on top of another branch, creating new commits with different hashes. This produces a linear history without merge commits. The trade-off is that it rewrites commit history, which can cause problems if others are working on the same branch.",
        },
        {
          heading: "Which should I use?",
          body: "Use merge for shared branches (main, develop) where preserving history matters. Use rebase for local feature branches before merging to keep history clean. The golden rule: never rebase commits that have been pushed to a shared remote branch.",
        },
      ],
      faqs: [
        {
          question: "Is git rebase dangerous?",
          answer:
            "Rebase rewrites commit history, which is safe for local unpushed branches. It becomes dangerous when you rebase commits that others have based work on. Stick to rebasing only your own unpushed feature branches.",
        },
        {
          question: "What is the difference between merge and rebase?",
          answer:
            "Merge creates a merge commit preserving both branch histories. Rebase replays commits on top of another branch for a linear history. Merge is safer; rebase is cleaner.",
        },
      ],
      keywords: [
        "git merge vs rebase",
        "git rebase vs merge",
        "when to use git rebase",
        "git merge or rebase",
        "git rebase explained",
      ],
      parentToolSlug: "git-command-builder",
      parentToolName: "Git Command Builder",
    },
    {
      slug: "git-reset-vs-revert",
      title: "Git Reset vs Revert",
      metaTitle: "Git Reset vs Revert — Undo Changes Safely | DevBolt",
      metaDescription:
        "Learn the difference between git reset and git revert. Understand when to use each to undo commits safely without losing work.",
      h1: "Git Reset vs Revert — Undo Changes Safely",
      intro:
        "Both reset and revert undo changes, but they work very differently. Use the builder above to construct the right command with safe defaults.",
      content: [
        {
          heading: "git reset — rewrite history",
          body: "git reset moves the branch pointer backward, effectively removing commits from history. --soft keeps changes staged, --mixed (default) keeps changes unstaged, --hard discards everything. Because it rewrites history, only use reset on unpushed commits.",
        },
        {
          heading: "git revert — safe undo",
          body: "git revert creates a new commit that undoes the changes from a previous commit. The original commit stays in history. This is safe to use on shared branches because it does not rewrite history. Use --no-edit to accept the default revert message.",
        },
        {
          heading: "Which should I use?",
          body: "Use revert for commits that have been pushed to a shared branch. Use reset for local unpushed commits where you want a clean history. When in doubt, use revert — it is always safe.",
        },
      ],
      faqs: [
        {
          question: "Can I undo a git reset?",
          answer:
            "Yes, using git reflog. Find the commit hash before the reset and run git reset --hard <hash>. Reflog keeps a history of HEAD changes for about 90 days.",
        },
        {
          question: "What does git reset --soft do?",
          answer:
            "git reset --soft HEAD~1 undoes the last commit but keeps all changes staged. This is useful when you want to amend or restructure a commit without losing any work.",
        },
      ],
      keywords: [
        "git reset vs revert",
        "git revert vs reset",
        "undo git commit",
        "git reset explained",
        "git revert explained",
        "git undo changes",
      ],
      parentToolSlug: "git-command-builder",
      parentToolName: "Git Command Builder",
    },
    {
      slug: "git-stash-guide",
      title: "Git Stash Guide",
      metaTitle: "Git Stash Guide — Save & Restore Work in Progress | DevBolt",
      metaDescription:
        "Complete guide to git stash. Learn to save, list, apply, pop, and drop stashes. Keep uncommitted work safe while switching branches.",
      h1: "Git Stash Guide — Save & Restore Work in Progress",
      intro:
        "Git stash lets you save uncommitted changes without committing them, so you can switch branches or pull updates cleanly. Build stash commands with the interactive tool above.",
      content: [
        {
          heading: "Basic stash workflow",
          body: "git stash saves your uncommitted changes (staged and unstaged) and reverts the working tree to HEAD. git stash pop restores the most recent stash and removes it from the stash list. This is the most common pattern: stash, switch branches, do work, switch back, pop.",
        },
        {
          heading: "Advanced stash usage",
          body: "Use git stash push -m 'description' to label stashes. git stash --include-untracked saves new untracked files too. git stash apply restores without removing from the list (useful when applying to multiple branches). git stash branch <name> creates a new branch from a stash.",
        },
      ],
      faqs: [
        {
          question: "Does git stash save untracked files?",
          answer:
            "By default, no. Use git stash --include-untracked (or -u) to also stash new files that have not been added to git. Use --all to include ignored files too.",
        },
        {
          question: "How do I stash only specific files?",
          answer:
            "Use git stash push <file1> <file2> to stash specific files. Or use git stash push -p for interactive mode where you can select individual hunks to stash.",
        },
      ],
      keywords: [
        "git stash",
        "git stash guide",
        "git stash pop",
        "git stash apply",
        "git save work in progress",
        "git stash tutorial",
      ],
      parentToolSlug: "git-command-builder",
      parentToolName: "Git Command Builder",
    },
  ],

  "csp-builder": [
    {
      slug: "csp-directives-guide",
      title: "CSP Directives Guide",
      metaTitle: "CSP Directives Guide — All Content Security Policy Directives Explained",
      metaDescription:
        "Complete guide to all Content Security Policy directives — default-src, script-src, style-src, img-src, and more. Learn what each directive controls with examples.",
      h1: "CSP Directives Guide",
      intro:
        "A comprehensive reference for every Content Security Policy directive. Understand what each directive controls, see practical examples, and learn which directives you need for your site.",
      content: [
        {
          heading: "What are CSP directives?",
          body: "CSP directives are rules that tell the browser which resources are allowed to load and execute on your page. Each directive controls a specific resource type: script-src controls JavaScript, style-src controls CSS, img-src controls images, and so on. The default-src directive acts as a fallback for any directive you don't explicitly set.",
        },
        {
          heading: "Fetch directives vs document directives",
          body: "Fetch directives (script-src, style-src, img-src, connect-src, font-src, media-src, object-src, frame-src, worker-src, manifest-src) control where resources can be loaded from. Document directives (base-uri, sandbox) control properties of the document itself. Navigation directives (form-action, frame-ancestors, navigate-to) control where the document can navigate or be embedded.",
        },
        {
          heading: "Source values explained",
          body: "'self' allows resources from the same origin. 'none' blocks all resources. 'unsafe-inline' allows inline scripts and styles (weakens CSP significantly). 'unsafe-eval' allows eval() and similar dynamic code execution. 'strict-dynamic' trusts scripts loaded by already-trusted scripts — used with nonces for modern CSP. Specific domains like https://cdn.example.com whitelist individual origins.",
        },
      ],
      faqs: [
        {
          question: "What is the most important CSP directive?",
          answer:
            "script-src is the most important for security — it controls which JavaScript can execute, directly preventing XSS attacks. Always set default-src as a fallback, then override with specific directives like script-src, style-src, and img-src.",
        },
        {
          question: "Do I need to set every directive?",
          answer:
            "No. Any directive not explicitly set falls back to default-src. Set default-src to 'self', then only override directives where you need different rules (e.g., img-src for CDN images, connect-src for API endpoints).",
        },
        {
          question: "What does 'strict-dynamic' do?",
          answer:
            "'strict-dynamic' tells the browser to trust scripts loaded by already-trusted scripts (those matching a nonce or hash). It ignores host-based allowlists, making your CSP resilient to bypass techniques. It's the recommended approach for modern SPAs.",
        },
      ],
      keywords: [
        "csp directives",
        "content security policy directives",
        "csp directive list",
        "csp reference",
        "csp script-src",
        "csp default-src",
      ],
      parentToolSlug: "csp-builder",
      parentToolName: "CSP Header Builder",
    },
    {
      slug: "csp-framework-examples",
      title: "CSP Framework Examples",
      metaTitle: "CSP Examples for Next.js, React, WordPress, Express & Nginx",
      metaDescription:
        "Ready-to-use Content Security Policy examples for popular frameworks — Next.js, React, WordPress, Express, Nginx, Apache, Vercel, and Netlify. Copy-paste CSP configs.",
      h1: "CSP Framework Examples",
      intro:
        "Copy-paste Content Security Policy configurations for popular frameworks and platforms. Each example is a tested starting point — customize it for your specific third-party services.",
      content: [
        {
          heading: "Next.js CSP configuration",
          body: "In Next.js, set CSP headers in next.config.js using the headers() function, or in middleware.ts for dynamic nonce-based CSP. Next.js requires 'unsafe-eval' for development hot reload and 'unsafe-inline' for styled-jsx. For production, use nonces with 'strict-dynamic' for the strongest policy.",
        },
        {
          heading: "Nginx and Apache CSP headers",
          body: "In Nginx, use: add_header Content-Security-Policy \"default-src 'self'; script-src 'self'\" always; — the 'always' flag ensures the header is sent on error pages too. In Apache, use: Header always set Content-Security-Policy \"default-src 'self'; script-src 'self'\". Place these in your server block or .htaccess respectively.",
        },
        {
          heading: "Vercel and Netlify CSP headers",
          body: "On Vercel, add headers in vercel.json under the headers array with a source pattern. On Netlify, use the [[headers]] section in netlify.toml or a _headers file. Both platforms support wildcards for applying CSP across all routes.",
        },
      ],
      faqs: [
        {
          question: "Why does my Next.js app break with a strict CSP?",
          answer:
            "Next.js uses inline scripts for hydration and CSS-in-JS libraries often inject inline styles. You need 'unsafe-inline' for style-src and either nonces or 'unsafe-eval' for script-src. Use the Next.js CSP preset in the builder as a starting point.",
        },
        {
          question: "How do I add CSP to Nginx?",
          answer:
            "Add this to your server block: add_header Content-Security-Policy \"your-policy-here\" always; The 'always' keyword ensures the header is sent even on error responses (404, 500). Test with Content-Security-Policy-Report-Only first.",
        },
        {
          question: "Can I use CSP with a CDN like Cloudflare?",
          answer:
            "Yes. Set CSP at your origin server. CDNs pass through response headers by default. Some CDNs (Cloudflare Workers, Vercel Edge) also let you add or modify headers at the edge. Make sure your CSP allows your CDN's domain in the relevant directives.",
        },
      ],
      keywords: [
        "csp next.js",
        "csp react",
        "csp nginx",
        "csp wordpress",
        "csp vercel",
        "content security policy examples",
        "csp express",
      ],
      parentToolSlug: "csp-builder",
      parentToolName: "CSP Header Builder",
    },
    {
      slug: "csp-common-issues",
      title: "Common CSP Issues",
      metaTitle: "Common CSP Issues & How to Fix Them — Troubleshooting Guide",
      metaDescription:
        "Fix common Content Security Policy errors: inline script blocked, refused to load, eval not allowed. Troubleshooting guide with solutions for every CSP error.",
      h1: "Common CSP Issues & Troubleshooting",
      intro:
        "Content Security Policy errors can break your site if misconfigured. This guide covers the most common CSP issues, explains what causes them, and shows you how to fix each one.",
      content: [
        {
          heading: "Refused to execute inline script",
          body: "This error means your CSP blocks inline <script> tags and on* event handlers. Fix options: (1) Move inline scripts to external files (best), (2) Add a nonce to each script tag and include 'nonce-{value}' in script-src, (3) Add 'unsafe-inline' to script-src (weakens security). Using nonces with 'strict-dynamic' is the recommended modern approach.",
        },
        {
          heading: "Refused to load the stylesheet",
          body: "Your CSP is blocking a CSS file or inline style. Check style-src — does it include the stylesheet's origin? For CSS-in-JS libraries (styled-components, Emotion), you need 'unsafe-inline' in style-src. For external stylesheets (Google Fonts), add the CDN domain: style-src 'self' https://fonts.googleapis.com.",
        },
        {
          heading: "Refused to connect",
          body: "Your fetch(), XHR, or WebSocket call is blocked. The connect-src directive controls these. Add your API endpoint domain: connect-src 'self' https://api.example.com. Don't forget WebSocket URLs (wss://), analytics endpoints, and any third-party APIs your app calls.",
        },
      ],
      faqs: [
        {
          question: "How do I debug CSP errors?",
          answer:
            "Open your browser's Developer Tools Console — CSP violations appear as errors with the blocked resource URL and the directive that blocked it. Use Content-Security-Policy-Report-Only header to test without breaking your site. You can also set up report-uri to collect violations server-side.",
        },
        {
          question: "What is Content-Security-Policy-Report-Only?",
          answer:
            "Report-Only mode logs CSP violations to the console (and optionally to a report-uri endpoint) without actually blocking anything. Use it to test a new CSP before enforcing it. Once you see no unexpected violations, switch to the enforcing Content-Security-Policy header.",
        },
        {
          question: "Why does my CSP work locally but break in production?",
          answer:
            "Common causes: (1) Third-party scripts loaded in production but not locally (analytics, chat widgets, ads), (2) CDN domains not in your allowlist, (3) Inline scripts added by your hosting platform, (4) Different URL schemes (http vs https). Always test with Report-Only in production first.",
        },
      ],
      keywords: [
        "csp errors",
        "csp troubleshooting",
        "refused to execute inline script",
        "csp refused to load",
        "content security policy error",
        "fix csp",
        "csp debug",
      ],
      parentToolSlug: "csp-builder",
      parentToolName: "CSP Header Builder",
    },
  ],

  "html-to-jsx": [
    {
      slug: "html-vs-jsx-differences",
      title: "HTML vs JSX Differences",
      metaTitle: "HTML vs JSX — Every Difference Explained with Examples",
      metaDescription:
        "Complete guide to every difference between HTML and JSX. Learn about className, htmlFor, self-closing tags, style objects, event handlers, and more with side-by-side examples.",
      h1: "HTML vs JSX — Every Difference Explained",
      intro:
        "JSX looks like HTML but has key differences that trip up developers. This guide covers every difference between HTML and JSX with side-by-side examples so you can convert confidently.",
      content: [
        {
          heading: "Reserved words: class and for",
          body: "The biggest gotcha: HTML's class attribute becomes className in JSX because 'class' is a reserved keyword in JavaScript. Similarly, the for attribute on <label> elements becomes htmlFor because 'for' is used for loops in JavaScript. These are the two most common conversion mistakes.",
        },
        {
          heading: "Inline styles are objects, not strings",
          body: "In HTML you write style=\"color: red; font-size: 16px\". In JSX, the style attribute takes a JavaScript object: style={{ color: 'red', fontSize: '16px' }}. CSS property names use camelCase (background-color becomes backgroundColor) and values are strings or numbers.",
        },
        {
          heading: "All tags must close",
          body: "HTML allows void elements like <br>, <img>, <input>, and <hr> without closing. JSX requires every element to either have a closing tag or self-close: <br />, <img />, <input />, <hr />. Forgetting to self-close void elements is the most common JSX syntax error.",
        },
        {
          heading: "Comments use JavaScript syntax",
          body: "HTML comments <!-- like this --> don't work in JSX. Instead, use JavaScript comments wrapped in curly braces: {/* like this */}. Multi-line comments work the same way. Comments outside of JSX expressions use standard // or /* */ JavaScript syntax.",
        },
      ],
      faqs: [
        {
          question: "Why does JSX use className instead of class?",
          answer: "'class' is a reserved keyword in JavaScript (used for class declarations). Since JSX compiles to JavaScript function calls, using 'class' would conflict with the language syntax. React chose 'className' to match the DOM API's element.className property.",
        },
        {
          question: "Can I use HTML directly in React without converting to JSX?",
          answer: "No — JSX is required in React components. While it looks like HTML, JSX compiles to React.createElement() calls. You must convert HTML attributes to their JSX equivalents (className, htmlFor, style objects, etc.) for the code to compile.",
        },
        {
          question: "What happens if I use class instead of className in JSX?",
          answer: "React will show a console warning: 'Invalid DOM property class. Did you mean className?' The attribute will still work in most browsers, but it's incorrect JSX and can cause issues with some React features.",
        },
      ],
      keywords: [
        "html vs jsx",
        "jsx vs html",
        "html jsx differences",
        "jsx differences",
        "class vs classname",
        "why classname in react",
        "jsx syntax",
      ],
      parentToolSlug: "html-to-jsx",
      parentToolName: "HTML to JSX Converter",
    },
    {
      slug: "react-jsx-cheatsheet",
      title: "React JSX Cheatsheet",
      metaTitle: "React JSX Cheatsheet — Attribute Mapping, Syntax, and Gotchas",
      metaDescription:
        "Quick-reference cheatsheet for React JSX syntax — attribute mappings, style objects, event handlers, conditional rendering, and common conversion patterns.",
      h1: "React JSX Cheatsheet",
      intro:
        "A quick-reference guide for JSX syntax covering attribute names, style objects, event handlers, and common patterns. Bookmark this page for fast lookups when converting HTML to React components.",
      content: [
        {
          heading: "Attribute name mappings",
          body: "The most common attribute renames: class → className, for → htmlFor, tabindex → tabIndex, readonly → readOnly, maxlength → maxLength, colspan → colSpan, rowspan → rowSpan, cellpadding → cellPadding, crossorigin → crossOrigin, autocomplete → autoComplete, autofocus → autoFocus, enctype → encType, datetime → dateTime.",
        },
        {
          heading: "SVG attribute names in JSX",
          body: "SVG attributes with hyphens become camelCase: stroke-width → strokeWidth, fill-opacity → fillOpacity, stroke-linecap → strokeLinecap, clip-path → clipPath, font-size → fontSize, text-anchor → textAnchor, dominant-baseline → dominantBaseline. The viewBox attribute is already camelCase and stays unchanged.",
        },
        {
          heading: "Event handler patterns",
          body: "HTML event attributes are lowercase (onclick, onchange, onsubmit). In JSX they're camelCase: onClick, onChange, onSubmit. Instead of inline JavaScript strings, pass function references: onClick={handleClick} or arrow functions: onClick={() => doSomething()}. The event object is a React SyntheticEvent.",
        },
        {
          heading: "Conditional rendering patterns",
          body: "JSX doesn't support if/else in expressions. Use ternary operators: {isLoggedIn ? <Dashboard /> : <Login />}. For show/hide, use logical AND: {showModal && <Modal />}. For multiple conditions, extract the logic into a variable or function before the return statement.",
        },
      ],
      faqs: [
        {
          question: "Do all HTML attributes change in JSX?",
          answer: "No — most attributes stay the same. Only about 20 common HTML attributes change names (class, for, tabindex, etc.) plus SVG attributes with hyphens. Standard attributes like id, href, src, alt, type, and value all work unchanged in JSX.",
        },
        {
          question: "How do I handle data- and aria- attributes in JSX?",
          answer: "data-* and aria-* attributes work exactly the same in JSX as in HTML. They're the exception to the camelCase rule — keep the hyphens: data-testid, aria-label, aria-hidden. React passes these through unchanged to the DOM.",
        },
        {
          question: "Is JSX the same as TSX?",
          answer: "TSX is JSX with TypeScript. The syntax is identical — the only difference is that .tsx files support TypeScript type annotations, generics, and interfaces. All JSX conversion rules (className, style objects, etc.) apply equally to TSX.",
        },
      ],
      keywords: [
        "jsx cheatsheet",
        "react jsx reference",
        "jsx attributes",
        "jsx syntax guide",
        "react attribute names",
        "jsx event handlers",
        "jsx quick reference",
      ],
      parentToolSlug: "html-to-jsx",
      parentToolName: "HTML to JSX Converter",
    },
    {
      slug: "jsx-style-objects",
      title: "JSX Style Objects Guide",
      metaTitle: "JSX Style Objects — Convert CSS to React Inline Styles",
      metaDescription:
        "Learn how to convert CSS inline styles to JSX style objects. Covers camelCase properties, numeric values, vendor prefixes, and common pitfalls.",
      h1: "JSX Style Objects — Converting CSS to React Inline Styles",
      intro:
        "In JSX, the style attribute takes a JavaScript object instead of a CSS string. This guide explains how to convert CSS properties to JSX style objects, handle units, vendor prefixes, and avoid common mistakes.",
      content: [
        {
          heading: "CSS to JSX style conversion rules",
          body: "Every CSS property with a hyphen becomes camelCase: background-color → backgroundColor, font-size → fontSize, border-radius → borderRadius, z-index → zIndex, box-shadow → boxShadow. Properties without hyphens stay the same: color, margin, padding, display, opacity.",
        },
        {
          heading: "Values and units",
          body: "String values need quotes: fontSize: '16px', display: 'flex'. Numeric pixel values can omit 'px': fontSize: 16 is equivalent to fontSize: '16px' for most properties. However, unitless properties like lineHeight, opacity, flex, and zIndex should always be numbers: lineHeight: 1.5, opacity: 0.8, zIndex: 100.",
        },
        {
          heading: "Vendor prefixes",
          body: "Vendor-prefixed properties capitalize the prefix: -webkit-transform → WebkitTransform, -moz-appearance → MozAppearance, -ms-overflow-style → msOverflowStyle. Note that ms- is lowercase (ms) while -webkit- and -moz- are uppercase (Webkit, Moz). React auto-prefixes many properties via style reconciliation.",
        },
        {
          heading: "Common pitfalls",
          body: "Don't use shorthand strings for multi-value properties in objects. margin: '10px 20px' works as a string, but you can also use individual properties: marginTop: 10, marginRight: 20. Watch out for content property in pseudo-elements — inline styles can't target pseudo-elements; use CSS classes or CSS-in-JS instead.",
        },
      ],
      faqs: [
        {
          question: "When should I use inline styles vs className in React?",
          answer: "Use className for static styles and inline style objects for truly dynamic values (animation positions, user-chosen colors, calculated dimensions). Avoid inline styles for hover, focus, or media query states — these require CSS classes or a CSS-in-JS library.",
        },
        {
          question: "Can I use CSS variables in JSX style objects?",
          answer: "Yes — set CSS custom properties with the object syntax: style={{ '--my-color': 'blue' }}. Read them in CSS with var(--my-color). This is a powerful pattern for passing dynamic values from React to CSS.",
        },
        {
          question: "Why does React use style objects instead of strings?",
          answer: "Style objects let React diff and update individual CSS properties efficiently. With strings, React would need to parse the entire style string to detect changes. Objects also provide better TypeScript support and prevent XSS via style injection.",
        },
      ],
      keywords: [
        "jsx style objects",
        "react inline styles",
        "css to jsx",
        "react style attribute",
        "jsx camelcase css",
        "react style object",
        "convert css to react",
      ],
      parentToolSlug: "html-to-jsx",
      parentToolName: "HTML to JSX Converter",
    },
  ],

  "json-to-code": [
    {
      slug: "json-to-go-struct",
      title: "JSON to Go Struct Generator",
      metaTitle:
        "JSON to Go Struct Generator Online — Free Tool | DevBolt",
      metaDescription:
        "Convert JSON to Go structs instantly with proper json tags, nested struct generation, and idiomatic naming. Free online tool — no signup required.",
      h1: "JSON to Go Struct Generator",
      intro:
        "Paste your JSON and instantly get Go structs with json tags, proper naming conventions, and nested type definitions. Everything runs in your browser — no data leaves your device.",
      content: [
        {
          heading: "Why Use Go Structs for JSON?",
          body: "Go's encoding/json package uses struct tags to map JSON fields to Go fields. Writing these structs by hand is tedious and error-prone, especially for deeply nested JSON. This generator infers the correct Go types (string, int64, float64, bool) and creates properly tagged structs automatically.",
        },
        {
          heading: "How Go JSON Tags Work",
          body: 'Each struct field gets a `json:"fieldName"` tag that tells encoding/json how to marshal and unmarshal. Field names are converted to PascalCase (Go convention for exported fields), while the tag preserves the original JSON key. Nested objects become separate named structs.',
        },
        {
          heading: "Integer vs Float Detection",
          body: "The generator distinguishes between int64 and float64 by checking if a number has a decimal part. Whole numbers like 42 become int64, while 3.14 becomes float64. Arrays infer their element type from the first item.",
        },
      ],
      faqs: [
        {
          question: "Does this handle nested JSON objects?",
          answer:
            "Yes. Each nested object becomes a separate Go struct with a descriptive name based on the parent struct and field name. For example, a 'address' field inside 'User' generates a 'UserAddress' struct.",
        },
        {
          question: "What about null values in JSON?",
          answer:
            "Null values are mapped to interface{} in Go, since the actual type cannot be determined from null alone. You may want to change these to pointers (*string, *int64) in your code.",
        },
        {
          question: "Can I use this with JSON arrays?",
          answer:
            "Yes. If your root JSON is an array of objects, the generator merges all objects to produce the most complete struct definition.",
        },
      ],
      keywords: [
        "json to go struct",
        "go struct generator",
        "json to golang",
        "go json tags",
        "convert json to go",
        "golang struct from json",
        "json2go",
      ],
      parentToolSlug: "json-to-code",
      parentToolName: "JSON to Code Generator",
    },
    {
      slug: "json-to-python-dataclass",
      title: "JSON to Python Dataclass Generator",
      metaTitle:
        "JSON to Python Dataclass Generator Online — Free Tool | DevBolt",
      metaDescription:
        "Convert JSON to Python dataclasses with type hints instantly. Handles nested objects, lists, Optional types. Free online tool — no signup required.",
      h1: "JSON to Python Dataclass Generator",
      intro:
        "Generate Python dataclasses with full type annotations from any JSON structure. Nested objects become separate dataclasses, arrays get proper list[T] hints, and null values become Optional.",
      content: [
        {
          heading: "Why Dataclasses Over Dicts?",
          body: "Python dataclasses provide type safety, IDE autocompletion, and self-documenting code compared to raw dictionaries. They also support default values, comparison, and hashing out of the box. This generator creates ready-to-use dataclasses from your JSON.",
        },
        {
          heading: "Type Hint Inference",
          body: "The generator maps JSON types to Python types: strings to str, booleans to bool, integers to int, floats to float, nulls to Optional[Any], and arrays to list[T]. Nested objects become separate dataclass definitions.",
        },
        {
          heading: "Snake Case Naming",
          body: "Python convention uses snake_case for variable names. The generator automatically converts camelCase JSON keys to snake_case field names, following PEP 8 naming conventions.",
        },
      ],
      faqs: [
        {
          question: "Does this generate Pydantic models?",
          answer:
            "This tool generates standard library dataclasses. You can easily convert the output to Pydantic models by replacing @dataclass with BaseModel inheritance and adjusting the syntax.",
        },
        {
          question: "How are nested objects handled?",
          answer:
            "Each nested JSON object becomes a separate @dataclass with a name derived from the parent class and field name. Dependencies are ordered so child classes are defined before parents.",
        },
        {
          question: "What imports are included?",
          answer:
            "The generated code includes imports for dataclass from dataclasses and Any, Optional from typing. You only need to add these to your project's standard library.",
        },
      ],
      keywords: [
        "json to python dataclass",
        "json to python class",
        "python type hints from json",
        "json to dataclass",
        "convert json to python",
        "python dataclass generator",
        "json2python",
      ],
      parentToolSlug: "json-to-code",
      parentToolName: "JSON to Code Generator",
    },
    {
      slug: "json-to-rust-struct",
      title: "JSON to Rust Struct Generator",
      metaTitle:
        "JSON to Rust Struct Generator Online — Free Tool | DevBolt",
      metaDescription:
        "Convert JSON to Rust structs with serde derive macros, proper snake_case naming, and serde(rename) attributes. Free online tool — no signup required.",
      h1: "JSON to Rust Struct Generator",
      intro:
        "Generate Rust structs from JSON with #[derive(Serialize, Deserialize)] and proper serde attributes. Fields use snake_case with automatic rename annotations when the JSON key differs.",
      content: [
        {
          heading: "Serde Integration",
          body: "The generated structs use serde's Serialize and Deserialize derive macros, the standard way to handle JSON in Rust. Fields that need renaming (e.g., camelCase JSON keys to snake_case Rust fields) get #[serde(rename = \"...\")] attributes automatically.",
        },
        {
          heading: "Rust Type Mapping",
          body: "JSON strings map to String, booleans to bool, integers to i64, floats to f64, arrays to Vec<T>, and null values to Option<serde_json::Value>. Nested objects become separate pub structs.",
        },
        {
          heading: "Ownership and Public Fields",
          body: "All fields are generated as pub for easy access. String types use owned String rather than &str since JSON deserialization typically produces owned data. You can adjust visibility and lifetimes as needed.",
        },
      ],
      faqs: [
        {
          question: "What crate dependencies do I need?",
          answer:
            "You need serde with the derive feature and serde_json in your Cargo.toml: serde = { version = \"1\", features = [\"derive\"] } and serde_json = \"1\".",
        },
        {
          question: "Does this handle optional fields?",
          answer:
            "Null JSON values become Option<serde_json::Value>. For more specific optional typing, you may want to manually adjust to Option<String> or Option<i64> based on your schema.",
        },
        {
          question: "Can I use this with nested JSON?",
          answer:
            "Yes. Each nested object becomes a separate named struct. The generator handles arbitrary nesting depth and creates properly ordered type definitions.",
        },
      ],
      keywords: [
        "json to rust struct",
        "rust struct generator",
        "json to rust",
        "serde json to struct",
        "convert json to rust",
        "rust serde derive",
        "json2rust",
      ],
      parentToolSlug: "json-to-code",
      parentToolName: "JSON to Code Generator",
    },
  ],

  "code-screenshot": [
    {
      slug: "code-screenshot-themes",
      title: "Code Screenshot Themes",
      metaTitle: "Code Screenshot Themes — Dracula, Monokai, Nord & More",
      metaDescription:
        "Browse 8 beautiful code screenshot themes including Dracula, Monokai, GitHub Dark, One Dark, Nord, Solarized, and Night Owl. Preview and compare themes for your code images.",
      h1: "Code Screenshot Themes — Compare & Preview",
      intro:
        "Explore all 8 code screenshot themes available in DevBolt. Each theme provides carefully tuned syntax highlighting colors for keywords, strings, comments, numbers, and more. Try them all in the generator above.",
      content: [
        {
          heading: "Dark Themes for Code",
          body: "Dark themes like Dracula, Monokai, and One Dark are the most popular choices for code screenshots. They provide high contrast text on dark backgrounds, reduce eye strain, and look professional when shared on social media or in documentation. Dracula uses distinctive purple and pink tones, while Monokai is known for its warm yellow-green palette.",
        },
        {
          heading: "Theme Color Palettes",
          body: "Each theme defines colors for 8 syntax token types: keywords (control flow, declarations), strings (quoted text), comments (annotations), numbers (literals), functions (calls), operators (symbols), types (class names), and plain text. The combination creates distinct visual identities that make code both readable and aesthetically pleasing.",
        },
        {
          heading: "Choosing the Right Theme",
          body: "For social media sharing, high-contrast themes like Dracula and Night Owl stand out. For documentation, GitHub Dark or GitHub Light match platform aesthetics. For presentations, One Dark and Nord provide clean, professional looks. Solarized Dark is popular among developers who prefer muted, eye-friendly colors.",
        },
      ],
      faqs: [
        {
          question: "Which theme is best for code screenshots?",
          answer:
            "Dracula and Monokai are the most popular for social media sharing due to their vibrant colors and high contrast. GitHub Dark is ideal for documentation. Choose based on your audience and context.",
        },
        {
          question: "Can I use a light theme for code screenshots?",
          answer:
            "Yes. GitHub Light provides a clean, readable light theme. Light themes work well for printed documentation, light-mode blog posts, and situations where dark screenshots would clash with the surrounding design.",
        },
        {
          question: "Are these the same themes as VS Code?",
          answer:
            "The color palettes are inspired by the same popular themes (Dracula, Monokai, etc.) but simplified for screenshot rendering. The token colors closely match the VS Code theme experience.",
        },
      ],
      keywords: [
        "code screenshot themes",
        "code image themes",
        "dracula code screenshot",
        "monokai code image",
        "dark theme code screenshot",
        "code screenshot colors",
        "best code screenshot theme",
      ],
      parentToolSlug: "code-screenshot",
      parentToolName: "Code Screenshot Generator",
    },
    {
      slug: "carbon-alternative",
      title: "Free Carbon Alternative",
      metaTitle: "Free Carbon Alternative — Code Screenshot Generator | DevBolt",
      metaDescription:
        "Create beautiful code screenshots without Carbon.sh limitations. DevBolt's code screenshot generator runs entirely in your browser — no data uploads, no API limits, fully private.",
      h1: "Free Carbon Alternative for Code Screenshots",
      intro:
        "Looking for a Carbon.sh alternative that respects your privacy? DevBolt's code screenshot generator runs 100% in your browser — your code never leaves your device. No accounts, no rate limits, no tracking.",
      content: [
        {
          heading: "Why Use DevBolt Instead of Carbon?",
          body: "Carbon.sh requires sending your code to a server for rendering. DevBolt generates screenshots entirely client-side using HTML Canvas, meaning your code never leaves your browser. This is crucial for proprietary code, API keys, or any sensitive content. Plus, there are no rate limits or account requirements.",
        },
        {
          heading: "Feature Comparison",
          body: "Both tools support multiple themes, syntax highlighting, window chrome, and PNG/JPEG export. DevBolt adds clipboard copy, transparent backgrounds, adjustable font sizes, and line number toggling. Carbon has a slightly larger theme library but requires server-side rendering.",
        },
        {
          heading: "Privacy-First Code Screenshots",
          body: "When you paste code into an online tool, you trust that tool with your data. DevBolt processes everything locally using the Canvas API — no network requests, no server logs, no data retention. Verify this yourself by checking the Network tab in your browser's DevTools.",
        },
      ],
      faqs: [
        {
          question: "Is DevBolt's code screenshot generator really free?",
          answer:
            "Yes, completely free with no signup required. The tool runs in your browser with no server costs, so there's no reason to charge or limit usage.",
        },
        {
          question: "Does Carbon.sh send my code to a server?",
          answer:
            "Yes. Carbon uses Puppeteer on the server to render screenshots. Your code is sent to their servers for processing. DevBolt renders everything locally in your browser using Canvas.",
        },
        {
          question: "Can I use this for work or commercial projects?",
          answer:
            "Yes. The generated screenshots are yours to use however you like — blog posts, documentation, social media, presentations, or any other purpose.",
        },
      ],
      keywords: [
        "carbon alternative",
        "carbon.sh alternative",
        "free code screenshot tool",
        "private code screenshot",
        "code screenshot no upload",
        "code image generator free",
        "carbon sh replacement",
      ],
      parentToolSlug: "code-screenshot",
      parentToolName: "Code Screenshot Generator",
    },
    {
      slug: "share-code-as-image",
      title: "Share Code as Image",
      metaTitle: "Share Code as Image — Code to PNG/JPEG for Social Media",
      metaDescription:
        "Convert code snippets to shareable images for Twitter, LinkedIn, blogs, and documentation. Beautiful syntax highlighting with customizable themes and backgrounds.",
      h1: "Share Code as Image — For Social Media & Blogs",
      intro:
        "Turn your code into beautiful, shareable images perfect for Twitter, LinkedIn, blog posts, and documentation. Choose from 8 themes and 9 backgrounds to make your code stand out.",
      content: [
        {
          heading: "Code Images for Social Media",
          body: "Code snippets shared as text get poor engagement on social platforms. Images with syntax highlighting, clean backgrounds, and window chrome attract 3-5x more engagement. They are visually striking in feeds and communicate technical concepts at a glance — perfect for sharing tips, tricks, and solutions.",
        },
        {
          heading: "Best Practices for Code Screenshots",
          body: "Keep snippets short (under 20 lines) for social sharing. Use a 14-16px font size for readability on mobile. Choose high-contrast themes like Dracula or Night Owl. Add a descriptive filename in the title bar. Use gradient backgrounds for social media posts and solid/transparent for documentation.",
        },
        {
          heading: "Supported Export Formats",
          body: "Download as PNG (lossless, supports transparency) for documentation and blogs. Use JPEG (smaller file size) for social media where transparency is not needed. Copy to clipboard for quick pasting into Slack, Discord, or design tools. All exports are 2x resolution for sharp display on Retina screens.",
        },
      ],
      faqs: [
        {
          question: "What resolution are the exported images?",
          answer:
            "Images are rendered at 2x resolution for crisp display on high-DPI (Retina) screens. A 14px font renders at 28px internally, ensuring sharp text even when scaled down.",
        },
        {
          question: "Can I share code screenshots on Twitter/X?",
          answer:
            "Yes. Download as PNG or JPEG and upload directly to Twitter, LinkedIn, or any social platform. Gradient backgrounds and window chrome make code images visually appealing in feeds.",
        },
        {
          question: "Is there a size limit for code?",
          answer:
            "No hard limit, but shorter snippets (5-25 lines) work best for sharing. Very long code will produce tall images that may be cropped on social platforms. The canvas scales automatically to fit your code.",
        },
      ],
      keywords: [
        "share code as image",
        "code to image",
        "code snippet image",
        "code to png",
        "code screenshot for twitter",
        "code image for blog",
        "share code on social media",
      ],
      parentToolSlug: "code-screenshot",
      parentToolName: "Code Screenshot Generator",
    },
  ],

  "css-to-tailwind": [
    {
      slug: "tailwind-spacing-classes",
      title: "Tailwind Spacing Classes Reference",
      metaTitle: "Tailwind Spacing Classes — Padding & Margin Conversion Guide | DevBolt",
      metaDescription:
        "Convert CSS padding and margin values to Tailwind spacing utilities. Complete reference for p-, m-, px-, py-, mx-, my- classes with rem and px values.",
      h1: "Tailwind Spacing Classes — Padding & Margin Reference",
      intro:
        "Tailwind uses a consistent spacing scale for padding, margin, gap, width, and height utilities. Paste your CSS into the converter above to instantly map px and rem values to Tailwind classes.",
      content: [
        {
          heading: "How Tailwind Spacing Works",
          body: "Tailwind's spacing scale maps numbers to rem values: 1 = 0.25rem (4px), 2 = 0.5rem (8px), 4 = 1rem (16px), 8 = 2rem (32px), etc. Padding uses p- (all sides), px- (horizontal), py- (vertical), pt/pr/pb/pl- (individual sides). Margin uses the same pattern with m- instead of p-. The scale goes from 0 to 96, plus special values like px (1px) and auto.",
        },
        {
          heading: "CSS Shorthand to Tailwind",
          body: "CSS shorthand like 'padding: 1rem 2rem' (vertical horizontal) converts to 'py-4 px-8' in Tailwind. Four-value shorthand 'margin: 0 auto 2rem 0' maps to 'mt-0 mx-auto mb-8 ml-0'. The converter handles all shorthand variants — 1 value (all sides), 2 values (vertical/horizontal), and 4 values (top/right/bottom/left).",
        },
        {
          heading: "Negative Spacing",
          body: "Tailwind supports negative margin with a dash prefix: -mt-4, -mx-2, -mb-8. Negative padding is not supported in Tailwind because negative padding has no valid CSS use case. The converter automatically maps negative margin values like 'margin-top: -1rem' to '-mt-4'.",
        },
      ],
      faqs: [
        {
          question: "What Tailwind class is 16px padding?",
          answer:
            "16px = 1rem = p-4 in Tailwind. For horizontal only: px-4. For vertical only: py-4. For individual sides: pt-4, pr-4, pb-4, pl-4.",
        },
        {
          question: "How do I center with margin auto in Tailwind?",
          answer:
            "'margin: 0 auto' converts to 'mx-auto' in Tailwind. This is the standard pattern for centering block elements. Add my-0 if you want to explicitly set vertical margin to zero.",
        },
        {
          question: "What if my spacing value is not in Tailwind's scale?",
          answer:
            "Use arbitrary values with bracket notation: p-[13px], m-[1.125rem], gap-[7px]. This works for any CSS value but should be used sparingly — prefer the built-in scale when possible for consistency.",
        },
      ],
      keywords: [
        "tailwind spacing classes",
        "tailwind padding classes",
        "tailwind margin classes",
        "css padding to tailwind",
        "tailwind spacing scale",
        "tailwind px py mx my",
      ],
      parentToolSlug: "css-to-tailwind",
      parentToolName: "CSS to Tailwind Converter",
    },
    {
      slug: "tailwind-flexbox-grid",
      title: "Tailwind Flexbox & Grid Classes",
      metaTitle: "Tailwind Flexbox & Grid Classes — CSS Layout Conversion | DevBolt",
      metaDescription:
        "Convert CSS flexbox and grid layout properties to Tailwind utility classes. flex-direction, justify-content, align-items, grid-template-columns, and gap.",
      h1: "Tailwind Flexbox & Grid Classes Reference",
      intro:
        "Flexbox and Grid are the backbone of modern CSS layouts. Convert your CSS layout rules to Tailwind utility classes with the converter above, or use this reference to learn the mappings.",
      content: [
        {
          heading: "CSS Flexbox to Tailwind",
          body: "The core flex properties map directly: display: flex → flex, flex-direction: column → flex-col, flex-wrap: wrap → flex-wrap, justify-content: center → justify-center, align-items: center → items-center. Flex shorthand works too: flex: 1 1 0% → flex-1, flex: none → flex-none. Grow and shrink have dedicated classes: flex-grow: 1 → grow, flex-shrink: 0 → shrink-0.",
        },
        {
          heading: "CSS Grid to Tailwind",
          body: "Grid template columns use the pattern grid-cols-N: grid-template-columns: repeat(3, 1fr) → grid-cols-3. Gap converts directly: gap: 1.5rem → gap-6, with row-gap and column-gap mapping to gap-y and gap-x respectively. Place utilities like place-content-center and place-items-center handle the less common alignment properties.",
        },
        {
          heading: "Common Layout Patterns",
          body: "Centered flex container: 'display: flex; align-items: center; justify-content: center' → 'flex items-center justify-center'. Responsive grid: use responsive prefixes like 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'. Sticky header: 'position: sticky; top: 0; z-index: 50' → 'sticky top-0 z-50'.",
        },
      ],
      faqs: [
        {
          question: "What is the Tailwind class for justify-content: space-between?",
          answer:
            "justify-between. Other justify-content values: flex-start → justify-start, center → justify-center, flex-end → justify-end, space-around → justify-around, space-evenly → justify-evenly.",
        },
        {
          question: "How do I make a responsive grid in Tailwind?",
          answer:
            "Use responsive prefixes: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'. This creates a 1-column layout on mobile, 2 columns on tablets, and 3 columns on desktops.",
        },
      ],
      keywords: [
        "tailwind flexbox classes",
        "tailwind grid classes",
        "css flexbox to tailwind",
        "css grid to tailwind",
        "tailwind justify center",
        "tailwind align items center",
        "tailwind grid cols",
      ],
      parentToolSlug: "css-to-tailwind",
      parentToolName: "CSS to Tailwind Converter",
    },
    {
      slug: "tailwind-typography-classes",
      title: "Tailwind Typography Classes",
      metaTitle: "Tailwind Typography Classes — Font Size, Weight & Text Conversion | DevBolt",
      metaDescription:
        "Convert CSS typography properties to Tailwind utility classes. font-size, font-weight, line-height, letter-spacing, text-align, and text-transform mappings.",
      h1: "Tailwind Typography Classes Reference",
      intro:
        "Convert CSS typography rules to Tailwind utility classes. This reference covers font-size, font-weight, line-height, letter-spacing, text-align, text-decoration, and text-transform conversions.",
      content: [
        {
          heading: "Font Size Scale",
          body: "Tailwind maps font sizes to a semantic scale: text-xs (0.75rem/12px), text-sm (0.875rem/14px), text-base (1rem/16px), text-lg (1.125rem/18px), text-xl (1.25rem/20px), text-2xl (1.5rem/24px), up to text-9xl (8rem/128px). Each size includes a default line-height for optimal readability.",
        },
        {
          heading: "Font Weight Classes",
          body: "CSS font-weight values map to named utilities: 100 → font-thin, 300 → font-light, 400 → font-normal, 500 → font-medium, 600 → font-semibold, 700 → font-bold, 800 → font-extrabold, 900 → font-black. Named values like 'bold' and 'normal' are also supported.",
        },
        {
          heading: "Text Styling Properties",
          body: "Text alignment: text-left, text-center, text-right, text-justify. Text decoration: underline, line-through, no-underline. Text transform: uppercase, lowercase, capitalize, normal-case. White space: whitespace-nowrap, whitespace-pre, whitespace-pre-wrap. Text overflow: text-ellipsis, text-clip (use with overflow-hidden and whitespace-nowrap for truncation).",
        },
      ],
      faqs: [
        {
          question: "What Tailwind class is font-size: 14px?",
          answer:
            "14px (0.875rem) maps to text-sm. The full scale: 12px → text-xs, 14px → text-sm, 16px → text-base, 18px → text-lg, 20px → text-xl, 24px → text-2xl, 30px → text-3xl, 36px → text-4xl.",
        },
        {
          question: "How do I truncate text in Tailwind?",
          answer:
            "Use the truncate utility class, which applies overflow: hidden, text-overflow: ellipsis, and white-space: nowrap. For multi-line truncation, use line-clamp-N (e.g., line-clamp-3 for 3 lines).",
        },
        {
          question: "What is the Tailwind class for letter-spacing?",
          answer:
            "Tailwind uses tracking- utilities: tracking-tighter (-0.05em), tracking-tight (-0.025em), tracking-normal (0), tracking-wide (0.025em), tracking-wider (0.05em), tracking-widest (0.1em).",
        },
      ],
      keywords: [
        "tailwind typography classes",
        "tailwind font size classes",
        "tailwind font weight classes",
        "css font to tailwind",
        "tailwind text classes",
        "tailwind text-sm text-lg",
      ],
      parentToolSlug: "css-to-tailwind",
      parentToolName: "CSS to Tailwind Converter",
    },
  ],

  "json-visualizer": [
    {
      slug: "json-tree-viewer",
      title: "JSON Tree Viewer Online",
      metaTitle: "JSON Tree Viewer Online — Interactive JSON Explorer | DevBolt",
      metaDescription:
        "View JSON as an interactive tree with collapsible nodes. Expand, collapse, search, and copy JSON paths. Free online JSON tree viewer — no signup, 100% client-side.",
      h1: "JSON Tree Viewer Online",
      intro:
        "Explore JSON data as a collapsible tree with real-time search, path copying, and depth controls. Everything runs in your browser — no data leaves your device.",
      content: [
        {
          heading: "What is a JSON tree viewer?",
          body: "A JSON tree viewer renders JSON data as a hierarchical tree structure where objects and arrays become expandable nodes. This makes it easy to navigate deeply nested data without scrolling through raw text. Unlike a plain text editor, a tree viewer lets you collapse irrelevant sections and focus on the data that matters.",
        },
        {
          heading: "When to use a JSON tree viewer",
          body: "Tree viewers are essential when working with large API responses, configuration files, or database exports. They help you quickly understand data structure, find specific values, verify nesting depth, and identify unexpected types. Developers commonly use them during debugging, API integration, and data migration.",
        },
      ],
      faqs: [
        {
          question: "Can I search within the JSON tree?",
          answer:
            "Yes. Type any key name or value in the search bar to highlight matching nodes. Use Ctrl+F to focus the search bar from anywhere on the page.",
        },
        {
          question: "Is my JSON data safe in an online viewer?",
          answer:
            "Yes. DevBolt's JSON viewer runs entirely in your browser using JavaScript. Your JSON is never sent to any server, making it safe for viewing sensitive API responses, credentials, and configuration data.",
        },
      ],
      keywords: [
        "json tree viewer",
        "json tree viewer online",
        "json tree",
        "view json as tree",
        "json node viewer",
        "interactive json viewer",
      ],
      parentToolSlug: "json-visualizer",
      parentToolName: "JSON Visualizer",
    },
    {
      slug: "json-explorer",
      title: "JSON Explorer — Navigate Nested Data",
      metaTitle: "JSON Explorer Online — Navigate Nested JSON Data | DevBolt",
      metaDescription:
        "Explore and navigate nested JSON data interactively. Copy JSON paths, expand to any depth, search keys and values. Free JSON explorer tool.",
      h1: "JSON Explorer Online",
      intro:
        "Navigate deeply nested JSON structures with expand/collapse controls, path copying, and instant search. Perfect for exploring API responses and config files.",
      content: [
        {
          heading: "Navigating nested JSON",
          body: "Deeply nested JSON is common in API responses, cloud configurations, and data pipelines. A JSON explorer lets you drill into specific branches without losing your place. Click any object or array node to expand it, and use depth controls (L2, L3, L5, All) to expand the entire tree to a specific level.",
        },
        {
          heading: "Copying JSON paths",
          body: "Hover over any node and click 'path' to copy its JSON path (e.g., $.data.users[0].name). JSON paths are useful for writing code that accesses specific values, configuring JSON path queries, and documenting API response structures. You can also copy the full value of any node as formatted or minified JSON.",
        },
      ],
      faqs: [
        {
          question: "What JSON path format does the explorer use?",
          answer:
            "The explorer uses dot notation with bracket syntax for arrays: $.data.users[0].name. The $ represents the root. This format is compatible with most JSON path libraries (JSONPath, jq).",
        },
        {
          question: "Can the explorer handle large JSON files?",
          answer:
            "The explorer works well with JSON files up to several megabytes. For very large files, use the depth controls to avoid expanding thousands of nodes at once. The tree is rendered on demand — collapsed nodes don't consume rendering resources.",
        },
      ],
      keywords: [
        "json explorer",
        "json explorer online",
        "explore json",
        "navigate json",
        "json path finder",
        "json data explorer",
      ],
      parentToolSlug: "json-visualizer",
      parentToolName: "JSON Visualizer",
    },
    {
      slug: "json-viewer-alternative",
      title: "JSON Crack / JSON Viewer Alternative",
      metaTitle: "JSON Crack Alternative — Free JSON Viewer Online | DevBolt",
      metaDescription:
        "Free JSON Crack alternative with interactive tree view, search, path copy, and stats. No signup, no tracking — 100% client-side JSON viewer.",
      h1: "Free JSON Crack Alternative",
      intro:
        "Looking for a free, privacy-focused alternative to JSON Crack or other online JSON viewers? DevBolt's JSON Visualizer offers an interactive tree, search, depth controls, and path copying — all running in your browser with zero data collection.",
      content: [
        {
          heading: "Why use DevBolt's JSON Viewer?",
          body: "Unlike many online JSON viewers that send your data to a server for processing, DevBolt's JSON Visualizer runs 100% client-side. Your JSON never leaves your browser. This makes it safe for viewing API keys, tokens, configuration secrets, and any other sensitive data you wouldn't want uploaded to a third-party server.",
        },
        {
          heading: "Features comparison",
          body: "DevBolt's JSON Visualizer includes: interactive collapsible tree, key/value search with highlighting, JSON path copy on hover, depth-level controls (collapse, L2, L3, L5, all), data statistics (keys, depth, type counts, size), copy as formatted or minified JSON, and multiple sample datasets. All features are free with no signup required.",
        },
      ],
      faqs: [
        {
          question: "Is this a replacement for JSON Crack?",
          answer:
            "DevBolt's JSON Visualizer provides a tree-based viewer that covers the most common JSON exploration needs: expanding/collapsing nodes, searching, and copying paths. JSON Crack offers a graph visualization which is better for seeing relationships. Both tools are useful for different purposes.",
        },
        {
          question: "Do I need to create an account?",
          answer:
            "No. DevBolt's JSON Visualizer is completely free with no signup, no account, and no usage limits. Just paste your JSON and start exploring.",
        },
      ],
      keywords: [
        "json crack alternative",
        "json viewer alternative",
        "free json viewer",
        "json viewer online free",
        "json viewer no signup",
        "private json viewer",
      ],
      parentToolSlug: "json-visualizer",
      parentToolName: "JSON Visualizer",
    },
  ],

  "svg-to-jsx": [
    {
      slug: "svg-to-react-component",
      title: "SVG to React Component",
      metaTitle: "SVG to React Component Converter — Free Online Tool | DevBolt",
      metaDescription:
        "Convert SVG files to React components with proper JSX attributes, forwardRef support, TypeScript types, and memo optimization. Free client-side tool.",
      h1: "SVG to React Component Converter",
      intro:
        "Transform raw SVG markup into production-ready React components. This tool converts attributes to JSX-compatible camelCase, wraps in a component function, and adds optional TypeScript types, forwardRef, and memo.",
      content: [
        {
          heading: "Why convert SVG to React components?",
          body: "Using SVG as React components gives you full control over icon styling via props, enables tree-shaking for smaller bundles, and allows dynamic color and size changes at runtime. Unlike <img> tags or CSS backgrounds, inline SVG components respond to theme changes, support accessibility attributes like <title> and aria-label, and can be composed with other React elements.",
        },
        {
          heading: "What this tool converts",
          body: "The converter handles 80+ SVG attribute mappings (stroke-width to strokeWidth, fill-opacity to fillOpacity, clip-path to clipPath, etc.), transforms inline style strings to JSX style objects, removes XML declarations and comments, strips namespace attributes, and optionally removes fixed width/height for responsive sizing. It outputs either raw JSX, a JavaScript component, or a fully typed TypeScript component.",
        },
      ],
      faqs: [
        {
          question: "Does this converter support TypeScript?",
          answer:
            "Yes. Select the 'React Component (TS)' output mode to get a typed component with SVGProps interface, optional custom props type, and proper Ref typing when using forwardRef.",
        },
        {
          question: "Can I use the output directly in a Next.js or Vite project?",
          answer:
            "Yes. The generated component is standard React and works in any React-based framework including Next.js, Vite, Remix, and Gatsby. Save the output as a .jsx or .tsx file and import it like any other component.",
        },
      ],
      keywords: [
        "svg to react component",
        "svg react component generator",
        "convert svg to react",
        "react svg component",
        "svg jsx component",
      ],
      parentToolSlug: "svg-to-jsx",
      parentToolName: "SVG to JSX Converter",
    },
    {
      slug: "svg-attribute-conversion",
      title: "SVG Attribute to JSX Reference",
      metaTitle: "SVG to JSX Attribute Conversion Reference — Free Tool | DevBolt",
      metaDescription:
        "Complete reference of SVG attributes that need conversion to JSX — stroke-width to strokeWidth, clip-path to clipPath, and 80+ more mappings.",
      h1: "SVG Attribute to JSX Conversion Reference",
      intro:
        "React requires SVG attributes in camelCase instead of kebab-case. This tool automatically converts all 80+ SVG attributes to their JSX equivalents so you never have to look them up manually.",
      content: [
        {
          heading: "Common SVG attribute conversions",
          body: "The most frequently needed conversions include: stroke-width → strokeWidth, fill-opacity → fillOpacity, stroke-linecap → strokeLinecap, stroke-linejoin → strokeLinejoin, clip-path → clipPath, fill-rule → fillRule, font-size → fontSize, text-anchor → textAnchor, stop-color → stopColor, and class → className. These cover the vast majority of SVG icons you will encounter.",
        },
        {
          heading: "Namespace and style handling",
          body: "Beyond simple attribute renaming, JSX requires inline styles as objects ({ strokeWidth: 2 } instead of 'stroke-width: 2'), xlink:href becomes xlinkHref, and namespace declarations like xmlns:xlink are typically removed since React handles SVG namespaces automatically. This tool handles all of these transformations.",
        },
      ],
      faqs: [
        {
          question: "Why does React require camelCase SVG attributes?",
          answer:
            "React uses a virtual DOM that maps to JavaScript object properties, which follow camelCase convention. Since JSX compiles to JavaScript function calls, attributes must be valid JavaScript identifiers — so stroke-width becomes strokeWidth.",
        },
        {
          question: "What happens to attributes the tool doesn't recognize?",
          answer:
            "Unrecognized attributes are passed through unchanged. Standard data-* and aria-* attributes are already valid in JSX and don't need conversion.",
        },
      ],
      keywords: [
        "svg jsx attributes",
        "svg camelcase attributes",
        "react svg attributes",
        "stroke-width jsx",
        "svg attribute reference",
      ],
      parentToolSlug: "svg-to-jsx",
      parentToolName: "SVG to JSX Converter",
    },
    {
      slug: "svg-icon-library",
      title: "Build an SVG Icon Library for React",
      metaTitle: "Build SVG Icon Library for React — Free Converter | DevBolt",
      metaDescription:
        "Convert SVG icons to React components for your own icon library. Supports forwardRef, memo, TypeScript, and tree-shaking. Free online tool.",
      h1: "Build an SVG Icon Library for React",
      intro:
        "Create a custom React icon library by converting your SVG icons to components with consistent props, forwardRef support, and TypeScript types. This tool generates production-ready code for each icon.",
      content: [
        {
          heading: "Why build a custom icon library?",
          body: "Custom icon libraries give you full control over icon design consistency, bundle size, and API surface. Unlike using icon font packages (which load all icons regardless of usage) or third-party React icon libraries (which may include thousands of unused icons), a custom library contains exactly the icons you need. Combined with tree-shaking, each page only bundles the icons it imports.",
        },
        {
          heading: "Best practices for React icon components",
          body: "Use forwardRef so parent components can access the SVG DOM element. Add memo to prevent unnecessary re-renders. Accept SVGProps via props spread so consumers can set className, onClick, aria-label, and other standard attributes. Remove fixed width/height and use currentColor for fill and stroke so icons inherit size and color from their parent. Include a displayName for better DevTools debugging.",
        },
      ],
      faqs: [
        {
          question: "Should I use forwardRef for all icon components?",
          answer:
            "It is a best practice to use forwardRef for icon components. It allows parent components to programmatically focus, measure, or animate the SVG element. Libraries like Radix UI and Headless UI expect forwardRef support from icon components.",
        },
        {
          question: "How do I make icons responsive to parent size?",
          answer:
            "Remove fixed width and height attributes (check 'Remove width/height' in this tool) and set viewBox on the SVG. Then control size via CSS or className on the component. The icon will scale to fill its container.",
        },
      ],
      keywords: [
        "react icon library",
        "svg icon components",
        "build icon library react",
        "svg to react icons",
        "custom icon library",
      ],
      parentToolSlug: "svg-to-jsx",
      parentToolName: "SVG to JSX Converter",
    },
  ],
  "prompt-builder": [
    {
      slug: "prompt-engineering-guide",
      title: "Prompt Engineering Guide",
      metaTitle: "Prompt Engineering Guide — Best Practices & Techniques | DevBolt",
      metaDescription:
        "Learn prompt engineering best practices: role assignment, few-shot examples, chain of thought, structured output, and constraints. Practical guide with examples for OpenAI, Anthropic, and Gemini.",
      h1: "Prompt Engineering Guide for Developers",
      intro:
        "Master the techniques that make AI prompts effective. This guide covers role assignment, few-shot learning, chain of thought, and structured output — with practical examples you can use immediately.",
      content: [
        {
          heading: "What is prompt engineering?",
          body: "Prompt engineering is the practice of designing inputs to AI language models to get accurate, useful, and consistent outputs. Unlike traditional programming where you write deterministic code, prompt engineering involves crafting natural language instructions that guide a probabilistic model. Good prompt engineering reduces hallucinations, improves output quality, and makes AI tools reliable enough for production workflows.",
        },
        {
          heading: "Core techniques",
          body: "The most effective prompt engineering techniques include: Role Assignment (giving the model an expert persona), Few-Shot Examples (providing 2-3 input/output pairs), Chain of Thought (asking the model to reason step by step), Structured Output (specifying exact response format like JSON or Markdown), and Constraint Setting (defining boundaries like max length, included/excluded topics, and style). Combining these techniques yields the best results.",
        },
        {
          heading: "System prompts vs user prompts",
          body: "System prompts define the AI's persona, capabilities, and rules — they persist across the conversation. User prompts contain the specific request or data for each turn. OpenAI and Anthropic support dedicated system message fields. For Gemini, system instructions are prepended as the first user message. Separating system and user content makes prompts more maintainable and reusable across different requests.",
        },
      ],
      faqs: [
        {
          question: "What is the best way to start a prompt?",
          answer:
            "Start with a clear role assignment in the system prompt (e.g., 'You are a senior TypeScript developer'), then provide context, the specific task, and the desired output format in the user prompt. This structure consistently produces better results than unstructured instructions.",
        },
        {
          question: "How many examples should I include in few-shot prompts?",
          answer:
            "Two to three examples are usually optimal. One example may not establish a clear pattern, while more than five can waste tokens without improving quality. Choose diverse examples that cover edge cases relevant to your use case.",
        },
        {
          question: "Does temperature affect prompt engineering?",
          answer:
            "Yes. Lower temperature (0-0.3) produces more deterministic, focused outputs — ideal for code generation and data extraction. Higher temperature (0.7-1.0) produces more creative, varied outputs — better for brainstorming and creative writing. Match temperature to your task.",
        },
      ],
      keywords: [
        "prompt engineering guide",
        "prompt engineering best practices",
        "ai prompt techniques",
        "chatgpt prompt tips",
        "prompt engineering for developers",
      ],
      parentToolSlug: "prompt-builder",
      parentToolName: "AI Prompt Template Builder",
    },
    {
      slug: "openai-vs-anthropic-prompts",
      title: "OpenAI vs Anthropic Prompt Formats",
      metaTitle: "OpenAI vs Anthropic API Prompt Formats Compared | DevBolt",
      metaDescription:
        "Compare OpenAI and Anthropic API prompt formats side by side. Learn the key differences in system messages, message structure, and parameters for ChatGPT/GPT-4 and Claude.",
      h1: "OpenAI vs Anthropic: API Prompt Format Comparison",
      intro:
        "OpenAI and Anthropic use different API structures for prompts. This guide compares them side by side so you can write prompts that work across both platforms or convert between them.",
      content: [
        {
          heading: "Message structure differences",
          body: "OpenAI places system instructions inside the messages array as a message with role 'system'. Anthropic uses a top-level 'system' parameter separate from the messages array. Both support alternating user/assistant messages for multi-turn conversations. This structural difference means you cannot simply copy-paste API payloads between providers — the system prompt must be moved to/from the messages array.",
        },
        {
          heading: "Model parameters compared",
          body: "Both APIs support temperature (0-1 for OpenAI, 0-1 for Anthropic), max tokens (max_tokens in both), and top_p. OpenAI additionally supports frequency_penalty and presence_penalty for repetition control. Anthropic supports stop_sequences for custom stop tokens. OpenAI defaults to no max token limit while Anthropic requires max_tokens to be specified explicitly.",
        },
        {
          heading: "When to use which format",
          body: "Use OpenAI format when targeting GPT-4o, GPT-4 Turbo, or o1/o3 models. Use Anthropic format for Claude Opus, Sonnet, and Haiku models. If building for multiple providers, use a template builder like DevBolt's to generate both formats from a single prompt. The core prompt content is the same — only the JSON wrapper changes.",
        },
      ],
      faqs: [
        {
          question: "Can I use the same prompt for OpenAI and Anthropic?",
          answer:
            "The prompt content (system instructions, user messages) can be identical, but the JSON structure differs. OpenAI puts system messages in the messages array while Anthropic uses a top-level system parameter. A prompt template builder can generate both formats from one source.",
        },
        {
          question: "Which API format does Gemini use?",
          answer:
            "Google Gemini uses a 'contents' array with 'parts' objects. It has no native system message field — system instructions are typically sent as the first user message, followed by a model acknowledgment. The generationConfig object controls temperature and max output tokens.",
        },
        {
          question: "Do OpenAI and Anthropic handle multi-turn differently?",
          answer:
            "Both require alternating user/assistant messages. OpenAI allows multiple consecutive system messages. Anthropic requires the first message to be from the user. Both support injecting previous conversation history for context.",
        },
      ],
      keywords: [
        "openai vs anthropic api",
        "chatgpt vs claude prompt format",
        "openai api format",
        "anthropic api format",
        "ai api comparison",
      ],
      parentToolSlug: "prompt-builder",
      parentToolName: "AI Prompt Template Builder",
    },
    {
      slug: "prompt-templates-developers",
      title: "AI Prompt Templates for Developers",
      metaTitle: "AI Prompt Templates for Developers — Code Review, Testing, Docs | DevBolt",
      metaDescription:
        "Ready-to-use AI prompt templates for code review, unit testing, API documentation, SQL generation, refactoring, and more. Copy and customize for ChatGPT, Claude, or Gemini.",
      h1: "AI Prompt Templates for Software Developers",
      intro:
        "Copy-paste prompt templates optimized for common developer tasks. Each template uses proven prompt engineering techniques — role assignment, structured output, and constraints — to get consistent, high-quality results.",
      content: [
        {
          heading: "Why use prompt templates?",
          body: "Prompt templates solve the biggest problem with AI-assisted development: inconsistent output quality. By standardizing your prompts with clear roles, structured tasks, and output format requirements, you get reliable results every time. Templates also save time — instead of crafting a new prompt for each code review or test generation task, you fill in variables and go. Teams can share templates to maintain consistent AI usage across projects.",
        },
        {
          heading: "Template anatomy",
          body: "Effective prompt templates have five sections: Role (who the AI is), Context (what it's working with), Task (what to do), Output Format (how to structure the response), and Constraints (boundaries and rules). Not every prompt needs all five sections, but including Role, Task, and Output Format dramatically improves output quality. Variables like {{language}} and {{framework}} make templates reusable across different projects.",
        },
        {
          heading: "Common developer prompt categories",
          body: "The most useful prompt template categories for developers are: Code Review (bugs, performance, security), Test Generation (unit tests, edge cases, coverage), Documentation (API docs, README, code comments), Code Explanation (line-by-line walkthrough, concept explanation), Refactoring (DRY, SOLID, readability), and Data Tasks (SQL generation, data analysis, schema design). Each category benefits from specialized system prompts and output formats.",
        },
      ],
      faqs: [
        {
          question: "What makes a good AI prompt for code review?",
          answer:
            "A good code review prompt assigns an expert reviewer role, specifies the language and project context, lists what to check (bugs, performance, security, style), and defines the output format (severity, affected code, issue description, fix suggestion). Including constraints like 'focus on top 5 issues' prevents overwhelming output.",
        },
        {
          question: "How do I create reusable prompt templates?",
          answer:
            "Use variables (e.g., {{language}}, {{framework}}) for values that change between uses. Structure your prompt into named sections (Role, Context, Task, Format, Constraints) that can be toggled on/off. Store templates in a builder tool or version-control them alongside your codebase.",
        },
        {
          question: "Should I use system prompts or include everything in the user message?",
          answer:
            "Use system prompts for persistent behavior (role, rules, output format) and user messages for per-request content (the actual code, data, or question). This separation makes templates more modular — you can reuse the same system prompt with different user inputs.",
        },
      ],
      keywords: [
        "ai prompt templates developers",
        "chatgpt code review prompt",
        "ai prompt for unit tests",
        "developer prompt templates",
        "code generation prompt",
      ],
      parentToolSlug: "prompt-builder",
      parentToolName: "AI Prompt Template Builder",
    },
  ],
  "mcp-config-builder": [
    {
      slug: "mcp-setup-guide",
      title: "MCP Setup Guide for AI Coding Assistants",
      metaTitle: "MCP Setup Guide — Configure Model Context Protocol for Any Client | DevBolt",
      metaDescription:
        "Step-by-step guide to setting up MCP (Model Context Protocol) servers for Claude Desktop, Claude Code, Cursor, VS Code, Windsurf, and Zed. Config file locations, formats, and troubleshooting.",
      h1: "MCP Setup Guide for AI Coding Assistants",
      intro:
        "Learn how to configure MCP (Model Context Protocol) servers for your AI coding assistant. This guide covers config file locations, JSON formats, and setup for all major clients.",
      content: [
        {
          heading: "What is MCP?",
          body: "The Model Context Protocol (MCP) is an open standard created by Anthropic that lets AI assistants connect to external tools and data sources. Instead of being limited to what the AI knows, MCP servers give your assistant the ability to read files, query databases, search the web, manage GitHub repos, and much more. MCP has been adopted by Claude Desktop, Claude Code, Cursor, VS Code (via Copilot), Windsurf, and Zed.",
        },
        {
          heading: "Config file locations by client",
          body: "Each AI client stores its MCP configuration in a different file and location. Claude Desktop uses claude_desktop_config.json in the app data directory. Claude Code uses .mcp.json in the project root. Cursor uses .cursor/mcp.json. VS Code uses .vscode/mcp.json. Windsurf uses mcp_config.json in ~/.codeium/windsurf/. Zed embeds MCP config in its settings.json. The JSON structure is similar across clients but the root key and some fields differ.",
        },
        {
          heading: "Common setup issues",
          body: "The most common MCP setup issues include: forgetting to restart the client after editing config, incorrect file paths in args, missing API keys in the env object, and using the wrong root key (VS Code uses 'servers' while most others use 'mcpServers', and Zed uses 'context_servers'). If a server fails to connect, check the client's MCP logs for specific error messages. Also ensure npx is in your PATH and Node.js is installed for npm-based servers.",
        },
      ],
      faqs: [
        {
          question: "Where do I put my MCP config file?",
          answer:
            "It depends on your AI client. Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\\Claude\\ (Windows). Cursor: .cursor/mcp.json in your project root. VS Code: .vscode/mcp.json. Always restart your client after saving changes.",
        },
        {
          question: "Do I need Node.js installed for MCP servers?",
          answer:
            "Most MCP servers are distributed as npm packages and launched via npx, so yes — you need Node.js (v18+) and npm installed. Some servers are available as Python packages (via uvx/pip) or Docker containers. Check the server's documentation for requirements.",
        },
        {
          question: "Can I use the same MCP config across different clients?",
          answer:
            "The server configurations (command, args, env) are the same, but the JSON wrapper differs between clients. Most clients use mcpServers as the root key, but VS Code uses 'servers' and Zed uses 'context_servers'. Use a config builder to generate the correct format for each client.",
        },
      ],
      keywords: [
        "mcp setup guide",
        "model context protocol setup",
        "claude desktop mcp config",
        "cursor mcp setup",
        "mcp server configuration",
      ],
      parentToolSlug: "mcp-config-builder",
      parentToolName: "MCP Config Builder",
    },
    {
      slug: "popular-mcp-servers",
      title: "Popular MCP Servers — Top 20 for AI Assistants",
      metaTitle: "Top 20 MCP Servers for AI Coding Assistants | DevBolt",
      metaDescription:
        "Curated list of the most popular MCP servers for AI assistants: Filesystem, GitHub, PostgreSQL, Memory, Brave Search, Playwright, Supabase, Sentry, and more. With setup instructions.",
      h1: "Top 20 MCP Servers for AI Assistants",
      intro:
        "A curated catalog of the most popular and useful MCP servers, organized by category. Each entry includes what it does, the npm package name, and required configuration.",
      content: [
        {
          heading: "Official MCP servers",
          body: "Anthropic maintains a set of official reference servers under the @modelcontextprotocol npm scope. The most popular are: Filesystem (secure file access with directory sandboxing), GitHub (repo management, PRs, issues), PostgreSQL (database queries), Memory (persistent knowledge graph), Fetch (web content retrieval), Git (repository operations), Sequential Thinking (structured reasoning), Brave Search (web search), Puppeteer (browser automation), SQLite (local database), and Time (timezone utilities). These are well-maintained and guaranteed to follow the MCP specification.",
        },
        {
          heading: "Third-party and vendor servers",
          body: "Major platforms have released their own MCP servers: Playwright by Microsoft for browser testing, Supabase for database/auth, Sentry for error tracking, Linear for issue management, Notion for workspace access, Slack for messaging, Cloudflare for Workers/KV/R2, and Docker for container management. Context7 provides up-to-date library documentation. These vendor servers are typically maintained by the platform teams and offer deep integration with their services.",
        },
        {
          heading: "Choosing the right servers",
          body: "Start with 2-3 servers that match your daily workflow. For most developers, Filesystem + GitHub + one database server covers the essentials. Add specialized servers as needed — Playwright for testing, Sentry for debugging production issues, or Slack/Linear for team communication. Each server adds startup time, so avoid installing servers you won't use regularly. You can always add more later without affecting existing configurations.",
        },
      ],
      faqs: [
        {
          question: "How many MCP servers can I run at once?",
          answer:
            "There's no hard limit, but each server is a separate process that consumes memory. Most developers run 3-5 servers. If you notice slowdowns, reduce the number of active servers. Claude Desktop and Cursor handle 10+ servers without issues on modern hardware.",
        },
        {
          question: "Are MCP servers safe to use?",
          answer:
            "Official @modelcontextprotocol servers are maintained by Anthropic and follow security best practices. Third-party servers vary — check the source code, npm download counts, and GitHub stars before installing. Servers run with your local permissions, so a filesystem server has access to any directory you configure. Always scope access to specific directories rather than giving root access.",
        },
        {
          question: "Can I build my own MCP server?",
          answer:
            "Yes. The MCP SDK is available for TypeScript (@modelcontextprotocol/sdk) and Python (mcp). A basic server that exposes tools, resources, or prompts can be built in under 100 lines of code. See the official MCP documentation and examples repository for starter templates.",
        },
      ],
      keywords: [
        "popular mcp servers",
        "best mcp servers",
        "mcp server list",
        "model context protocol servers",
        "mcp github server",
      ],
      parentToolSlug: "mcp-config-builder",
      parentToolName: "MCP Config Builder",
    },
    {
      slug: "mcp-client-comparison",
      title: "MCP Client Config Comparison — Claude vs Cursor vs VS Code",
      metaTitle: "MCP Config Comparison: Claude Desktop vs Cursor vs VS Code vs Windsurf | DevBolt",
      metaDescription:
        "Compare MCP configuration formats across Claude Desktop, Claude Code, Cursor, VS Code, Windsurf, and Zed. Side-by-side JSON structure, root keys, file locations, and unique features.",
      h1: "MCP Config Comparison: Claude Desktop vs Cursor vs VS Code",
      intro:
        "Each AI client uses a slightly different MCP configuration format. This comparison helps you understand the differences so you can set up MCP correctly — or migrate configs between clients.",
      content: [
        {
          heading: "JSON structure differences",
          body: "Most clients (Claude Desktop, Claude Code, Cursor, Windsurf) use 'mcpServers' as the root key. VS Code breaks the pattern by using 'servers' instead, and also adds support for an 'inputs' array that prompts users for secrets. Zed is the most different — it uses 'context_servers' as the root key and nests the command under a 'command' object with a 'path' field instead of a top-level 'command' string. The server entries themselves (command, args, env) are consistent across all clients.",
        },
        {
          heading: "Remote server support",
          body: "VS Code has the best native HTTP support — you just set type to 'http' and provide a url. Windsurf supports remote servers via a 'serverUrl' field. Claude Desktop, Claude Code, Cursor, and Zed don't have native HTTP transport — you use the mcp-remote npm package as a bridge (npx -y mcp-remote https://your-server-url). This difference matters if you're connecting to cloud-hosted MCP servers rather than running them locally.",
        },
        {
          heading: "Unique features by client",
          body: "Claude Code supports ${VAR} environment variable expansion and CLI management (claude mcp add/remove). VS Code supports ${input:id} variables that prompt users for secrets, plus ${workspaceFolder} for paths. Windsurf supports env var interpolation in all fields including serverUrl and headers. Zed's nested command structure allows for cleaner separation of the executable path from its arguments. Cursor offers both project-level (.cursor/mcp.json) and global (~/.cursor/mcp.json) config scopes.",
        },
      ],
      faqs: [
        {
          question: "Can I share MCP configs between Claude Desktop and Cursor?",
          answer:
            "Yes — both use the same 'mcpServers' root key and identical server entry format (command, args, env). You can copy the mcpServers object between claude_desktop_config.json and .cursor/mcp.json without changes. For VS Code, you'll need to rename the root key to 'servers'.",
        },
        {
          question: "Why does VS Code use a different root key?",
          answer:
            "VS Code's MCP support was built by the GitHub Copilot team and uses 'servers' as the root key. It also adds features like the 'inputs' array for secret prompts and ${workspaceFolder} variables. While the root key differs, the individual server configurations are compatible with other clients.",
        },
        {
          question: "Which client has the best MCP support?",
          answer:
            "Claude Desktop and Claude Code have the most mature MCP support since Anthropic created the protocol. Cursor has excellent MCP integration with both project and global scopes. VS Code's MCP support is newer but adds unique features like secret prompts. The best choice depends on your primary development workflow.",
        },
      ],
      keywords: [
        "mcp config comparison",
        "claude desktop vs cursor mcp",
        "vs code mcp config format",
        "mcp client differences",
        "mcp json format comparison",
      ],
      parentToolSlug: "mcp-config-builder",
      parentToolName: "MCP Config Builder",
    },
  ],
  "openapi-to-typescript": [
    {
      slug: "openapi-codegen-typescript",
      title: "OpenAPI TypeScript Code Generation",
      metaTitle:
        "OpenAPI TypeScript Code Generation Online — Free Tool | DevBolt",
      metaDescription:
        "Generate TypeScript interfaces and types from OpenAPI 3.x specs online. Handles $ref, allOf/oneOf, enums, and nested schemas. Free client-side codegen tool.",
      h1: "OpenAPI TypeScript Code Generation Online",
      intro:
        "Paste an OpenAPI specification and instantly generate TypeScript types for every schema and API operation. Everything runs in your browser — your spec is never uploaded.",
      content: [
        {
          heading: "Why generate TypeScript from OpenAPI?",
          body: "OpenAPI specifications define your API's contract — the request and response shapes, parameter types, and available endpoints. Generating TypeScript types from this contract ensures your frontend code stays in sync with your API, catching type mismatches at compile time rather than runtime. This is especially valuable in large codebases where APIs evolve frequently.",
        },
        {
          heading: "How does online codegen compare to CLI tools?",
          body: "CLI tools like openapi-typescript-codegen (2.14M weekly npm downloads) are great for CI pipelines, but an online converter is faster for one-off tasks: reviewing a new API's types, prototyping a client, or checking what types a spec produces before committing to a code generation pipeline. DevBolt's converter handles the same core features — $ref resolution, composition types, enums — without installing anything.",
        },
      ],
      faqs: [
        {
          question: "What OpenAPI versions are supported?",
          answer:
            "DevBolt supports OpenAPI 3.0.x, 3.1.x, and Swagger 2.0 specifications in both JSON and YAML formats. The converter auto-detects which version you're using.",
        },
        {
          question:
            "Does this tool handle $ref and allOf/oneOf/anyOf?",
          answer:
            "Yes. $ref pointers within the spec are resolved to clean TypeScript type names. allOf becomes intersection types (A & B), while oneOf and anyOf become union types (A | B).",
        },
        {
          question: "Is my API specification uploaded to a server?",
          answer:
            "No. The entire conversion runs client-side in your browser using JavaScript. Your OpenAPI spec never leaves your device.",
        },
      ],
      keywords: [
        "openapi typescript codegen",
        "openapi typescript generator online",
        "generate typescript from openapi",
        "openapi code generation",
        "swagger typescript codegen",
      ],
      parentToolSlug: "openapi-to-typescript",
      parentToolName: "OpenAPI to TypeScript Converter",
    },
    {
      slug: "swagger-to-typescript",
      title: "Swagger to TypeScript Converter",
      metaTitle:
        "Swagger to TypeScript Converter Online — Free Tool | DevBolt",
      metaDescription:
        "Convert Swagger 2.0 definitions to TypeScript interfaces and types. Handles refs, enums, nested objects, and request/response types. Free online tool.",
      h1: "Swagger to TypeScript Converter Online",
      intro:
        "Convert Swagger 2.0 specs to TypeScript types instantly. Paste your swagger.json or YAML file and get properly typed interfaces for every definition and API operation.",
      content: [
        {
          heading: "Swagger 2.0 vs OpenAPI 3.x",
          body: "Swagger 2.0 stores schemas under 'definitions' and uses 'consumes'/'produces' for content types. OpenAPI 3.x moved schemas to 'components.schemas' and introduced 'requestBody' and 'content' negotiation. DevBolt's converter handles both formats transparently — just paste your spec and it auto-detects the version.",
        },
        {
          heading: "Migrating from Swagger to OpenAPI",
          body: "If you're still on Swagger 2.0, generating TypeScript types from your spec is a good first step toward understanding your API surface before migrating. The generated types will be identical regardless of spec version, so you can migrate your spec without changing your TypeScript code.",
        },
      ],
      faqs: [
        {
          question: "Can I convert swagger.json to TypeScript?",
          answer:
            "Yes. Paste your swagger.json content directly into the input field. The converter auto-detects JSON format and the Swagger 2.0 version, then generates TypeScript interfaces from every definition.",
        },
        {
          question:
            "What's the difference between Swagger and OpenAPI types?",
          answer:
            "The generated TypeScript types are identical. The main difference is where schemas are stored in the spec: 'definitions' (Swagger 2.0) vs 'components.schemas' (OpenAPI 3.x). DevBolt handles both automatically.",
        },
      ],
      keywords: [
        "swagger to typescript",
        "swagger typescript converter",
        "swagger json to typescript",
        "convert swagger to types",
        "swagger 2.0 typescript",
      ],
      parentToolSlug: "openapi-to-typescript",
      parentToolName: "OpenAPI to TypeScript Converter",
    },
    {
      slug: "openapi-typescript-interfaces",
      title: "OpenAPI TypeScript Interfaces Guide",
      metaTitle:
        "OpenAPI to TypeScript Interfaces — Guide & Online Tool | DevBolt",
      metaDescription:
        "Learn how to generate TypeScript interfaces from OpenAPI schemas. Covers $ref, enums, nullable, allOf, and API operation types with a free online converter.",
      h1: "OpenAPI to TypeScript Interfaces",
      intro:
        "A practical guide to generating TypeScript interfaces from OpenAPI specifications, covering schema types, composition patterns, and API operation typing.",
      content: [
        {
          heading: "Interface vs type alias",
          body: "TypeScript interfaces support declaration merging and are generally preferred for object shapes. Type aliases are required for union types (oneOf/anyOf) and intersection types (allOf). DevBolt lets you choose your preferred style. For schemas that use composition, type aliases are used automatically regardless of your setting.",
        },
        {
          heading: "Handling enums",
          body: "OpenAPI enums are converted to TypeScript string literal union types (e.g., type Status = \"active\" | \"inactive\" | \"pending\"). This is more idiomatic in TypeScript than using the enum keyword, as it works better with type narrowing and doesn't generate any runtime JavaScript.",
        },
        {
          heading: "Nullable and optional fields",
          body: "Fields listed in the 'required' array become required TypeScript properties; others get the optional marker (?). The nullable: true flag adds '| null' to the type. You can also toggle 'all optional' to make every field optional, useful when generating types for PATCH endpoints or partial updates.",
        },
      ],
      faqs: [
        {
          question:
            "Should I use interfaces or type aliases for OpenAPI types?",
          answer:
            "Use interfaces for plain object schemas (they support declaration merging and are more readable). Use type aliases for schemas using allOf/oneOf/anyOf, as these require intersection or union types which can't be expressed with interfaces.",
        },
        {
          question:
            "How are additionalProperties converted to TypeScript?",
          answer:
            "OpenAPI additionalProperties maps to TypeScript's Record type. For example, additionalProperties: { type: string } becomes Record<string, string>. Untyped additionalProperties become Record<string, unknown>.",
        },
      ],
      keywords: [
        "openapi typescript interfaces",
        "openapi generate interfaces",
        "typescript interface from openapi",
        "openapi schema typescript",
        "openapi enum typescript",
      ],
      parentToolSlug: "openapi-to-typescript",
      parentToolName: "OpenAPI to TypeScript Converter",
    },
  ],

  "json-to-zod": [
    {
      slug: "json-schema-to-zod",
      title: "JSON Schema to Zod Converter",
      metaTitle:
        "JSON Schema to Zod Converter Online — Free Tool | DevBolt",
      metaDescription:
        "Convert JSON Schema definitions to Zod validation schemas online. Supports $ref, allOf/oneOf/anyOf, enum, format constraints, required fields, and nested objects. Free and private.",
      h1: "JSON Schema to Zod Converter Online",
      intro:
        "Paste a JSON Schema and instantly generate Zod validation code. Handles $ref references, composition keywords (allOf, oneOf, anyOf), enums, format constraints, and required/optional field mapping.",
      content: [
        {
          heading: "Why convert JSON Schema to Zod?",
          body: "JSON Schema is the industry standard for describing JSON data structures, used in OpenAPI specs, configuration files, and API documentation. Zod is the dominant runtime validation library in TypeScript with 90M+ weekly npm downloads. Converting JSON Schema to Zod gives you compile-time types AND runtime validation from a single source of truth — eliminating the drift between your schema definitions and TypeScript types.",
        },
        {
          heading: "Supported JSON Schema features",
          body: "This converter handles the most commonly used JSON Schema keywords: type (string, number, integer, boolean, null, object, array), properties and required, $ref with $defs/definitions resolution, allOf (intersection), oneOf/anyOf (union), enum and const, format (email, uri, uuid, date-time, date, ipv4, ipv6), pattern (regex), minimum/maximum, exclusiveMinimum/exclusiveMaximum, minLength/maxLength, minItems/maxItems, default values, description, nullable, and additionalProperties.",
        },
        {
          heading: "How $ref resolution works",
          body: "Local $ref pointers like #/$defs/Address or #/definitions/Project are resolved to separate named Zod schemas. The converter generates each referenced schema as its own const variable and references it by name in parent schemas. This produces clean, readable code that mirrors your JSON Schema's structure rather than inlining everything into a single massive schema.",
        },
      ],
      faqs: [
        {
          question:
            "Does this tool handle $ref and allOf/oneOf/anyOf from JSON Schema?",
          answer:
            "Yes. Local $ref pointers within $defs or definitions are resolved to named Zod schemas. allOf maps to z.intersection(), while oneOf and anyOf map to z.union(). Nested compositions are fully supported.",
        },
        {
          question:
            "How are required and optional fields handled?",
          answer:
            "Fields listed in the JSON Schema required array become required Zod fields. All other properties get .optional() appended automatically. You can also toggle the global .optional() checkbox to make all fields optional regardless of the schema.",
        },
        {
          question: "What JSON Schema draft versions are supported?",
          answer:
            "The converter supports Draft-07 and Draft 2020-12 keywords including $defs (2020-12) and definitions (Draft-07). Most JSON Schema features used in practice are covered.",
        },
      ],
      keywords: [
        "json schema to zod",
        "convert json schema to zod",
        "json schema zod converter",
        "json schema zod",
        "zod from json schema",
        "json schema to zod online",
      ],
      parentToolSlug: "json-to-zod",
      parentToolName: "JSON to Zod Converter",
    },
    {
      slug: "zod-validation-guide",
      title: "Zod Validation Guide for TypeScript",
      metaTitle:
        "Zod Validation Guide for TypeScript — Schemas & Types | DevBolt",
      metaDescription:
        "Learn Zod validation for TypeScript: schemas, types, refinements, transforms, and integration with React Hook Form, tRPC, and Next.js. Practical examples and best practices.",
      h1: "Zod Validation Guide for TypeScript",
      intro:
        "Zod is the most popular TypeScript-first schema validation library with 90M+ weekly npm downloads. This guide covers everything from basic schemas to advanced patterns used in production TypeScript applications.",
      content: [
        {
          heading: "Why Zod dominates TypeScript validation",
          body: "Zod solves a fundamental TypeScript problem: TypeScript types exist only at compile time and are erased at runtime. Zod schemas validate data at runtime AND infer TypeScript types via z.infer<typeof schema>, giving you a single source of truth. This eliminates the common bug where your TypeScript interface says a field is a string but the API actually returns null. Zod catches this at runtime instead of crashing in production.",
        },
        {
          heading: "Common Zod patterns",
          body: "z.string().email() validates email format. z.number().int().positive() ensures positive integers. z.enum(['admin', 'user', 'viewer']) creates a union of literal types. z.object({}).strict() rejects unknown keys. z.array(z.string()).min(1) requires at least one item. z.union([z.string(), z.number()]) accepts either type. z.discriminatedUnion('type', [...]) efficiently validates tagged unions. These patterns cover 90% of real-world validation needs.",
        },
        {
          heading: "Zod with React Hook Form, tRPC, and Next.js",
          body: "Zod integrates deeply with the TypeScript ecosystem. With React Hook Form, use @hookform/resolvers/zod to get automatic form validation with type-safe error messages. With tRPC, Zod schemas define your API input/output types and validate them automatically. With Next.js Server Actions, Zod validates form submissions on the server. These integrations mean your Zod schemas become the contract between your frontend and backend.",
        },
      ],
      faqs: [
        {
          question: "Is Zod better than Yup or Joi for TypeScript?",
          answer:
            "For TypeScript projects, Zod is generally the best choice. Unlike Yup and Joi, Zod was built from scratch for TypeScript with first-class type inference via z.infer. Yup's TypeScript support was retrofitted and has edge cases where inferred types are incorrect. Joi has no official TypeScript type inference at all.",
        },
        {
          question: "How do I use Zod with React Hook Form?",
          answer:
            "Install @hookform/resolvers, then pass your Zod schema to useForm: useForm({ resolver: zodResolver(mySchema) }). Form errors will automatically match your Zod validation messages, and the form data type is inferred from the schema.",
        },
        {
          question: "Does Zod work at runtime or only at compile time?",
          answer:
            "Both. Zod validates data at runtime (schema.parse(data) throws if invalid, schema.safeParse(data) returns a result object). It also infers TypeScript types at compile time via z.infer<typeof schema>. This dual behavior is Zod's key advantage.",
        },
      ],
      keywords: [
        "zod validation",
        "zod typescript",
        "zod guide",
        "zod tutorial",
        "zod react hook form",
        "zod trpc",
        "zod next.js",
      ],
      parentToolSlug: "json-to-zod",
      parentToolName: "JSON to Zod Converter",
    },
    {
      slug: "zod-vs-yup-vs-joi",
      title: "Zod vs Yup vs Joi — TypeScript Validation Comparison",
      metaTitle:
        "Zod vs Yup vs Joi — TypeScript Validation Comparison | DevBolt",
      metaDescription:
        "Compare Zod, Yup, and Joi for TypeScript validation. Type inference, bundle size, performance, ecosystem integration, and migration guide. Which validation library should you use?",
      h1: "Zod vs Yup vs Joi — TypeScript Validation Comparison",
      intro:
        "Choosing a validation library for TypeScript? Compare Zod, Yup, and Joi across type safety, bundle size, performance, and ecosystem integration to find the best fit for your project.",
      content: [
        {
          heading: "Type inference comparison",
          body: "Zod: First-class TypeScript inference via z.infer — every schema automatically produces the correct TypeScript type, including unions, intersections, optionals, and transforms. Yup: InferType<typeof schema> exists but has known edge cases with nullable/optional fields and transforms. Joi: No official TypeScript type inference — you must manually write interfaces that mirror your schemas, creating a maintenance burden and drift risk.",
        },
        {
          heading: "Bundle size and performance",
          body: "Zod: ~13KB minified+gzipped. Yup: ~12KB minified+gzipped. Joi: ~30KB+ minified+gzipped (designed for Node.js, not optimized for browsers). For frontend applications, Zod and Yup are comparable in size. Joi is significantly larger and was designed for server-side use. Performance is similar for typical validation workloads — the difference is negligible for most applications.",
        },
        {
          heading: "When to use each library",
          body: "Use Zod for new TypeScript projects, especially with tRPC, Next.js, or React Hook Form — it has the best TypeScript integration and fastest-growing ecosystem. Use Yup if you have an existing Formik-based codebase — Formik was built around Yup and migration would be costly. Use Joi for Node.js-only backends where you need extensive validation features and don't need TypeScript type inference.",
        },
      ],
      faqs: [
        {
          question: "Should I migrate from Yup to Zod?",
          answer:
            "If you rely on z.infer for type safety across your app, the migration is worthwhile. If you only use Yup for form validation with Formik and don't need type inference, the migration cost may not justify the benefit. For new features, consider using Zod alongside Yup and gradually migrating.",
        },
        {
          question: "Which validation library has the most downloads?",
          answer:
            "Zod leads with 90M+ weekly npm downloads (as of early 2026), followed by Joi at ~10M and Yup at ~6M. Zod's growth has been explosive — it surpassed both Joi and Yup in 2024 and continues to accelerate.",
        },
        {
          question: "Can I use Zod and Yup together in the same project?",
          answer:
            "Yes. They are independent libraries with no conflicts. This is a practical migration strategy: use Zod for new code and tRPC/API layers while keeping Yup for existing Formik forms. Gradually replace Yup schemas as you touch those files.",
        },
      ],
      keywords: [
        "zod vs yup",
        "zod vs joi",
        "yup vs zod",
        "zod yup comparison",
        "typescript validation library",
        "best validation library typescript",
      ],
      parentToolSlug: "json-to-zod",
      parentToolName: "JSON to Zod Converter",
    },
  ],
  "jwt-builder": [
    {
      slug: "jwt-claims-guide",
      title: "JWT Claims Guide",
      metaTitle:
        "JWT Claims Guide — Standard & Custom Claims Explained | DevBolt",
      metaDescription:
        "Learn about JWT registered claims (iss, sub, aud, exp, iat, nbf, jti), public claims, and private claims. Understand when to use each claim type in your tokens.",
      h1: "JWT Claims Guide — Standard & Custom Claims",
      intro:
        "JSON Web Tokens carry claims — statements about the user and metadata. Understanding which claims to include and how they're validated is essential for building secure authentication and authorization systems.",
      content: [
        {
          heading: "Registered claims",
          body: 'The JWT specification (RFC 7519) defines seven registered claims: "iss" (issuer) identifies who created the token, "sub" (subject) identifies who the token is about, "aud" (audience) specifies the intended recipient, "exp" (expiration time) sets when the token expires as a Unix timestamp, "nbf" (not before) sets the earliest time the token is valid, "iat" (issued at) records when the token was created, and "jti" (JWT ID) provides a unique identifier to prevent replay attacks. All are optional but strongly recommended for production tokens.',
        },
        {
          heading: "Public and private claims",
          body: "Public claims are registered in the IANA JSON Web Token Claims registry to avoid collisions — examples include \"email\", \"name\", and \"preferred_username\" from OpenID Connect. Private claims are custom key-value pairs agreed upon between the issuer and consumer, such as \"role\", \"permissions\", or \"tenant_id\". Use namespaced keys (e.g., \"https://example.com/role\") for private claims shared across multiple services to avoid naming conflicts.",
        },
        {
          heading: "Best practices for claims",
          body: "Keep payloads small — every claim increases token size and network overhead. Never store sensitive data (passwords, credit card numbers) in claims since JWTs are only encoded, not encrypted by default. Always set an expiration (exp) to limit the damage from token theft. Use the audience (aud) claim to prevent tokens issued for one service from being accepted by another. For refresh tokens, prefer opaque tokens stored server-side over long-lived JWTs.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between iat and nbf in JWT?",
          answer:
            '"iat" (issued at) records when the token was created. "nbf" (not before) specifies the earliest time the token should be accepted. A token might be issued at 10:00 (iat) but not valid until 10:05 (nbf), useful for scheduled access or clock skew tolerance.',
        },
        {
          question: "Should I put user roles in JWT claims?",
          answer:
            "Yes, for authorization decisions that don't change frequently. Including roles like \"admin\" or \"editor\" in claims avoids a database lookup on every request. However, if roles change often, the stale JWT will still contain old roles until it expires. Use short expiration times or a token revocation list to mitigate this.",
        },
        {
          question: "How large can a JWT payload be?",
          answer:
            "There is no specification limit, but practical limits apply. Most HTTP servers cap header size at 8 KB. Since JWTs are typically sent in the Authorization header, keep the total token under 4-6 KB. A typical auth token with 5-10 claims is around 300-500 bytes encoded.",
        },
      ],
      keywords: [
        "JWT claims",
        "JWT registered claims",
        "JWT custom claims",
        "iss sub aud exp",
        "JWT payload fields",
        "JWT best practices",
      ],
      parentToolSlug: "jwt-builder",
      parentToolName: "JWT Builder",
    },
    {
      slug: "hs256-vs-rs256",
      title: "HS256 vs RS256 — JWT Signing Algorithms",
      metaTitle:
        "HS256 vs RS256 — JWT Signing Algorithm Comparison | DevBolt",
      metaDescription:
        "Compare HMAC (HS256) and RSA (RS256) JWT signing algorithms. Learn when to use symmetric vs asymmetric signing, key management, and security trade-offs.",
      h1: "HS256 vs RS256 — JWT Signing Algorithms Compared",
      intro:
        "Choosing between HS256 (HMAC) and RS256 (RSA) is one of the most important decisions when implementing JWT authentication. Each algorithm has different security properties, key management requirements, and performance characteristics.",
      content: [
        {
          heading: "HS256 — symmetric signing",
          body: "HS256 uses HMAC with SHA-256, a symmetric algorithm where the same secret key signs and verifies the token. It is fast, simple to implement, and works well when the token issuer and verifier are the same service or share a trusted secret. The main risk is secret distribution — every service that needs to verify tokens must have the secret, and a leaked secret compromises all tokens.",
        },
        {
          heading: "RS256 — asymmetric signing",
          body: "RS256 uses RSA with SHA-256, an asymmetric algorithm with a private key for signing and a public key for verification. The private key stays with the issuer (auth server), while verifiers only need the public key. This is ideal for microservices and third-party integrations because the public key can be freely distributed without compromising token security. The trade-off is larger token size (~256 bytes for the signature vs ~32 bytes for HS256) and slower signing.",
        },
        {
          heading: "When to use which",
          body: "Use HS256 for monolithic applications where the same service issues and verifies tokens, internal tools with a single trusted secret, and when simplicity and performance matter most. Use RS256 for microservice architectures where multiple services verify tokens, OAuth 2.0 and OpenID Connect implementations, public APIs where clients need to verify tokens without a shared secret, and JWKS (JSON Web Key Set) rotation scenarios.",
        },
      ],
      faqs: [
        {
          question: "Is RS256 more secure than HS256?",
          answer:
            "Not inherently — both are secure when used correctly. RS256 has better key management properties because the verification key (public) cannot be used to forge tokens. HS256 is equally secure cryptographically but requires careful secret distribution. The \"alg: none\" attack and key confusion attacks are implementation bugs, not algorithm weaknesses.",
        },
        {
          question: "Can I switch from HS256 to RS256 without breaking existing tokens?",
          answer:
            "No. Tokens signed with HS256 cannot be verified with an RS256 public key, and vice versa. To migrate, issue new tokens with RS256 while continuing to verify old HS256 tokens during a transition period. Set short expiration times on HS256 tokens to speed up the migration.",
        },
        {
          question: "What about ES256 (ECDSA)?",
          answer:
            "ES256 uses Elliptic Curve Digital Signatures, offering the same asymmetric benefits as RS256 with smaller keys and signatures. An ES256 signature is ~64 bytes vs ~256 bytes for RS256. It is increasingly preferred for new implementations, especially in mobile and IoT where bandwidth matters.",
        },
      ],
      keywords: [
        "HS256 vs RS256",
        "JWT signing algorithms",
        "HMAC vs RSA JWT",
        "symmetric vs asymmetric JWT",
        "JWT algorithm comparison",
        "RS256 vs HS256",
      ],
      parentToolSlug: "jwt-builder",
      parentToolName: "JWT Builder",
    },
    {
      slug: "jwt-security-best-practices",
      title: "JWT Security Best Practices",
      metaTitle:
        "JWT Security Best Practices — Avoid Common Vulnerabilities | DevBolt",
      metaDescription:
        "Learn JWT security best practices: prevent alg:none attacks, set proper expiration, validate all claims, and handle token storage securely. Avoid the most common JWT vulnerabilities.",
      h1: "JWT Security Best Practices",
      intro:
        "JWTs are powerful but easy to misuse. Common vulnerabilities include algorithm confusion, missing validation, excessive token lifetimes, and insecure storage. Follow these best practices to build secure JWT-based systems.",
      content: [
        {
          heading: "Always validate the algorithm",
          body: "The most critical JWT vulnerability is the \"alg: none\" attack, where an attacker modifies the header to use the \"none\" algorithm, removing signature verification. Always whitelist allowed algorithms on the server side — never trust the \"alg\" header from the token itself. Most JWT libraries support an \"algorithms\" parameter that restricts which algorithms are accepted during verification.",
        },
        {
          heading: "Set short expiration times",
          body: "Access tokens should expire in 5-15 minutes for high-security applications and up to 1 hour for lower-risk scenarios. Use refresh tokens (stored securely, preferably server-side) to issue new access tokens without requiring re-authentication. Short-lived tokens limit the window of abuse if a token is stolen. Never create tokens without an expiration claim.",
        },
        {
          heading: "Secure token storage",
          body: "In browsers, store tokens in httpOnly, Secure, SameSite cookies — not localStorage or sessionStorage, which are vulnerable to XSS attacks. If you must use localStorage (e.g., for SPAs calling third-party APIs), implement Content Security Policy headers and sanitize all user input rigorously. In mobile apps, use the platform keychain (iOS Keychain, Android Keystore). Never log or expose tokens in URLs.",
        },
        {
          heading: "Validate all claims",
          body: "Always verify: the signature is valid, the token has not expired (exp), the issuer (iss) matches your expected issuer, the audience (aud) includes your service, and the token is not being used before its \"not before\" time (nbf). Skipping any of these checks opens attack vectors. Additionally, maintain a token blacklist or use short expiration for immediate revocation needs.",
        },
      ],
      faqs: [
        {
          question: "Should I encrypt my JWTs?",
          answer:
            "Standard JWTs (JWS) are signed but not encrypted — the payload is Base64url-encoded and readable by anyone. If your payload contains sensitive data, use JWE (JSON Web Encryption) or, better yet, keep sensitive data out of the token entirely and store it server-side, referenced by a claim like \"sub\" or \"jti\".",
        },
        {
          question: "How do I revoke a JWT before it expires?",
          answer:
            "JWTs are stateless by design, so there is no built-in revocation mechanism. Common approaches: maintain a server-side blacklist of revoked token IDs (jti), use very short expiration times with refresh tokens, or switch to opaque tokens for scenarios requiring immediate revocation. Each approach trades off between statelessness and control.",
        },
        {
          question: "Is it safe to decode JWTs in the browser?",
          answer:
            "Yes — decoding (reading the payload) is safe and expected. The payload is not secret; it is only Base64url-encoded. However, never trust a decoded token without verifying its signature on the server side. Client-side decoding is useful for displaying user info or checking expiration, but all authorization decisions must happen server-side after signature verification.",
        },
      ],
      keywords: [
        "JWT security",
        "JWT best practices",
        "JWT vulnerabilities",
        "alg none attack",
        "JWT token storage",
        "secure JWT implementation",
      ],
      parentToolSlug: "jwt-builder",
      parentToolName: "JWT Builder",
    },
  ],

  "tsconfig-builder": [
    {
      slug: "tsconfig-strict-mode",
      title: "TypeScript Strict Mode Guide",
      metaTitle:
        "TypeScript Strict Mode Guide — What strict Enables & Why You Should Use It",
      metaDescription:
        "Learn what TypeScript strict mode enables — noImplicitAny, strictNullChecks, and 6 more flags. Understand each flag with code examples and migration tips.",
      h1: "TypeScript Strict Mode Guide",
      intro:
        "TypeScript's strict flag enables 8 type-checking options at once. Use the builder above to toggle individual strict flags and see exactly how they affect your tsconfig.json output.",
      content: [
        {
          heading: "What does strict: true enable?",
          body: "Setting \"strict\": true in tsconfig.json enables 8 flags: noImplicitAny, strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, alwaysStrict, and useUnknownInCatchVariables. Each flag catches a different category of bugs. New projects should always start with strict: true.",
        },
        {
          heading: "noImplicitAny vs strictNullChecks",
          body: "noImplicitAny prevents variables from silently receiving the 'any' type when TypeScript cannot infer a more specific type. strictNullChecks makes null and undefined their own types, preventing you from assigning null to a string variable. Together, these two flags catch the majority of type-related bugs in real-world codebases.",
        },
        {
          heading: "Migrating to strict mode",
          body: "To migrate an existing project: first set strict: false and enable individual flags one at a time, starting with noImplicitAny and strictNullChecks. Fix errors for each flag before enabling the next. Alternatively, enable strict: true and use // @ts-expect-error or 'as any' annotations to suppress errors temporarily, then fix them incrementally.",
        },
        {
          heading: "Beyond strict: extra strictness flags",
          body: "Two popular flags are NOT included in strict: noUncheckedIndexedAccess adds undefined to index signature results (obj['key'] becomes string | undefined), and exactOptionalPropertyTypes distinguishes between optional properties and properties explicitly set to undefined. Both are recommended for maximum type safety.",
        },
      ],
      faqs: [
        {
          question: "Should I always use strict: true?",
          answer:
            "Yes. Every new TypeScript project should start with strict: true. It catches more bugs at compile time and makes your code more maintainable. The TypeScript team recommends it as the baseline for all projects.",
        },
        {
          question:
            "What is the difference between strict and individual strict flags?",
          answer:
            "strict: true is a shorthand that enables 8 individual flags at once. Setting strict: true and then setting one flag to false (e.g., strictNullChecks: false) is valid — the individual flag overrides. This lets you opt out of specific checks while keeping the rest.",
        },
        {
          question: "Does strict mode make TypeScript slower?",
          answer:
            "Strict mode has minimal impact on compilation speed. The additional type checks run during the same pass as non-strict checks. The slight increase in compile time is vastly outweighed by the bugs caught before runtime.",
        },
      ],
      keywords: [
        "typescript strict mode",
        "tsconfig strict",
        "strict true typescript",
        "noImplicitAny",
        "strictNullChecks",
        "typescript strict flags",
        "enable strict mode typescript",
      ],
      parentToolSlug: "tsconfig-builder",
      parentToolName: "tsconfig.json Visual Builder",
    },
    {
      slug: "tsconfig-nextjs",
      title: "tsconfig.json for Next.js",
      metaTitle:
        "tsconfig.json for Next.js — Recommended TypeScript Configuration",
      metaDescription:
        "The recommended tsconfig.json for Next.js projects with App Router. Learn why each compiler option is set and how to customize it for your Next.js app.",
      h1: "tsconfig.json for Next.js Projects",
      intro:
        "Next.js has specific TypeScript requirements. Use the Next.js preset in the builder above to generate the recommended tsconfig.json, then customize it for your project.",
      content: [
        {
          heading: "Why Next.js uses specific tsconfig settings",
          body: "Next.js uses 'jsx': 'preserve' because it handles JSX transformation internally via SWC. 'moduleResolution': 'Bundler' matches how Next.js resolves imports. 'noEmit': true prevents tsc from outputting files since Next.js builds with its own compiler. 'incremental': true enables faster type-checking by caching build information.",
        },
        {
          heading: "Next.js path aliases",
          body: "Next.js supports path aliases via the paths option. The most common pattern is '@/*': ['./src/*'] which lets you import from '@/components/Header' instead of '../../../components/Header'. Next.js automatically configures its bundler to resolve these aliases — no additional Webpack or Turbopack configuration is needed.",
        },
        {
          heading: "The next-env.d.ts file",
          body: "Next.js generates a next-env.d.ts file that includes type declarations for Next.js-specific features like next/image, next/link, and environment variables. This file should be included in your tsconfig's include array and added to .gitignore. Never edit it manually — Next.js regenerates it on every build.",
        },
      ],
      faqs: [
        {
          question: "What target should I use for Next.js?",
          answer:
            "Next.js recommends 'target': 'ES2017'. This is the minimum target that supports async/await without downlevel transformation. Since Next.js transpiles your code with SWC, the target mainly affects type-checking behavior, not the actual output.",
        },
        {
          question: "Should I use isolatedModules with Next.js?",
          answer:
            "Yes. Next.js uses SWC which transpiles files individually (not as a whole program). isolatedModules: true ensures your code is compatible with single-file transpilation by flagging patterns that require full program analysis, like const enums across files.",
        },
        {
          question: "How do I add custom type declarations in Next.js?",
          answer:
            "Create a declarations.d.ts (or any .d.ts file) in your project root and make sure it is covered by the include array. For example, declare module '*.svg' { const content: string; export default content; } lets you import SVG files as strings.",
        },
      ],
      keywords: [
        "tsconfig next.js",
        "next.js tsconfig.json",
        "next.js typescript config",
        "tsconfig for next.js",
        "next.js typescript setup",
        "next.js compiler options",
      ],
      parentToolSlug: "tsconfig-builder",
      parentToolName: "tsconfig.json Visual Builder",
    },
    {
      slug: "module-resolution-guide",
      title: "TypeScript Module Resolution Guide",
      metaTitle:
        "TypeScript Module Resolution Guide — Node vs Bundler vs Node16",
      metaDescription:
        "Understand TypeScript module resolution strategies: Node, Node16, NodeNext, and Bundler. Learn which one to use for your project with practical examples.",
      h1: "TypeScript Module Resolution Guide",
      intro:
        "TypeScript's moduleResolution setting controls how import statements are resolved to files. Use the builder above to switch between strategies and see how it changes your tsconfig.json.",
      content: [
        {
          heading: "Module resolution strategies explained",
          body: "TypeScript offers 5 module resolution strategies: 'Node' (legacy, mimics Node.js require()), 'Node16'/'NodeNext' (modern Node.js with package.json exports support), 'Bundler' (for Webpack/Vite/esbuild/Turbopack), and 'Classic' (TypeScript 1.x legacy, avoid). Most new projects should use 'Bundler' for frontend or 'Node16'/'NodeNext' for backend.",
        },
        {
          heading: "When to use Bundler resolution",
          body: "Use 'Bundler' when your code is processed by a bundler (Webpack, Vite, esbuild, Turbopack, Rollup). Bundler resolution allows extensionless imports (import './utils' resolves to utils.ts), respects package.json 'exports' field, and supports conditional exports. This is the right choice for React, Next.js, Vue, and most frontend projects.",
        },
        {
          heading: "When to use Node16 / NodeNext",
          body: "Use 'Node16' or 'NodeNext' for pure Node.js projects that run without a bundler. These strategies enforce Node.js ESM rules: imports must include file extensions (import './utils.js'), package.json must have '\"type\": \"module\"' for ESM, and both require() and import can coexist based on file extension (.mjs/.cjs). Use 'NodeNext' to always track the latest Node.js behavior.",
        },
        {
          heading: "Module and moduleResolution pairing",
          body: "Common pairings: ESNext + Bundler (frontend/bundled projects), Node16 + Node16 (Node.js ESM), CommonJS + Node (legacy Node.js). Mismatched pairs cause confusing errors. TypeScript 5.2+ recommends setting both module and moduleResolution explicitly rather than relying on defaults.",
        },
      ],
      faqs: [
        {
          question:
            "What is the difference between Node and Node16 module resolution?",
          answer:
            "Node (legacy) mimics classic Node.js require() resolution — it checks node_modules, index.js, and JSON files. Node16 adds support for package.json 'exports' field, ESM/CJS dual packages, and requires file extensions in ESM imports. Use Node16 for any Node.js project using modern packages.",
        },
        {
          question:
            "Why do I get 'Cannot find module' errors after changing moduleResolution?",
          answer:
            "Each strategy resolves imports differently. Switching from 'Node' to 'Node16' may require adding file extensions to imports. Switching to 'Bundler' may fix extensionless imports that 'Node16' rejected. Check that your module and moduleResolution are a compatible pair.",
        },
        {
          question: "Should I use ESNext or ES2022 for the module setting?",
          answer:
            "Use ESNext for frontend/bundled projects — it always targets the latest ECMAScript module features. Use ES2022 or Node16 for Node.js when you want predictable, stable behavior that matches a specific Node.js version's module semantics.",
        },
      ],
      keywords: [
        "typescript module resolution",
        "tsconfig moduleResolution",
        "node vs bundler resolution",
        "node16 module resolution",
        "typescript import resolution",
        "module resolution typescript",
      ],
      parentToolSlug: "tsconfig-builder",
      parentToolName: "tsconfig.json Visual Builder",
    },
  ],

  "graphql-to-typescript": [
    {
      slug: "graphql-codegen-guide",
      title: "GraphQL Code Generation Guide",
      metaTitle:
        "GraphQL Code Generation Guide — From Schema to TypeScript Types",
      metaDescription:
        "Learn how to generate TypeScript types from GraphQL schemas. Compare online tools, CLI codegen, and IDE plugins for type-safe GraphQL development.",
      h1: "GraphQL Code Generation Guide",
      intro:
        "GraphQL's type system maps naturally to TypeScript. Use the converter above to paste any GraphQL SDL schema and get TypeScript interfaces instantly — no CLI setup required.",
      content: [
        {
          heading: "Why generate TypeScript from GraphQL?",
          body: "GraphQL schemas define types, fields, and relationships. Manually writing matching TypeScript interfaces is error-prone and quickly becomes stale as the schema evolves. Automated code generation ensures your frontend types always match your API contract, catching mismatches at compile time instead of runtime.",
        },
        {
          heading: "Schema-first vs code-first",
          body: "Schema-first development writes the .graphql SDL file first, then generates types and resolvers. Code-first uses libraries like Nexus or TypeGraphQL to define the schema in TypeScript, which generates the SDL. Both approaches benefit from codegen: schema-first generates client types, code-first generates the SDL for documentation and client sharing.",
        },
        {
          heading: "What gets generated?",
          body: "A typical GraphQL-to-TypeScript pipeline produces: interfaces for object types and input types, TypeScript enums or const objects for GraphQL enums, union types for GraphQL unions, and argument types for query/mutation fields. Advanced tools also generate typed hooks (useQuery, useMutation) for React, Vue, or Angular.",
        },
        {
          heading: "Online tool vs CLI codegen",
          body: "CLI tools like @graphql-codegen/cli integrate into your build pipeline and watch for schema changes. Online tools like this converter are ideal for quick one-off conversions, exploring unfamiliar APIs, or when you don't want to install dependencies. Both produce the same TypeScript output from the same SDL input.",
        },
      ],
      faqs: [
        {
          question: "Can I convert a GraphQL introspection result to TypeScript?",
          answer:
            "This tool accepts GraphQL SDL (Schema Definition Language). If you have an introspection JSON result, you can convert it to SDL first using tools like graphql-js's buildClientSchema and printSchema functions, then paste the SDL here.",
        },
        {
          question: "Does this tool support GraphQL fragments?",
          answer:
            "This tool focuses on schema types (type, input, enum, union, interface, scalar). Fragment definitions are query-level constructs and are handled by query-aware codegen tools like @graphql-codegen/typescript-operations.",
        },
        {
          question: "How are custom scalars handled?",
          answer:
            "Common scalars like DateTime, JSON, UUID, and BigInt are mapped to appropriate TypeScript types automatically. Unknown scalars default to 'unknown'. You can customize these mappings in advanced codegen configurations.",
        },
      ],
      keywords: [
        "graphql codegen",
        "graphql code generation",
        "graphql typescript codegen",
        "generate types from graphql",
        "graphql-codegen typescript",
        "graphql schema types",
      ],
      parentToolSlug: "graphql-to-typescript",
      parentToolName: "GraphQL to TypeScript Converter",
    },
    {
      slug: "graphql-types-explained",
      title: "GraphQL Type System Explained",
      metaTitle:
        "GraphQL Type System Explained — Types, Inputs, Enums, Unions & Interfaces",
      metaDescription:
        "Understand every GraphQL type kind: object types, input types, enums, unions, interfaces, and scalars. Learn how each maps to TypeScript with examples.",
      h1: "GraphQL Type System Explained",
      intro:
        "GraphQL has a rich type system that maps cleanly to TypeScript. Use the converter above to see how each GraphQL type translates to TypeScript interfaces, enums, and type aliases.",
      content: [
        {
          heading: "Object types",
          body: "Object types are the most common. 'type User { id: ID!, name: String! }' becomes a TypeScript interface with the same fields. Non-null fields (!) become required properties, nullable fields become optional or have '| null'. Arrays like '[Post!]!' become 'Post[]'.",
        },
        {
          heading: "Input types",
          body: "Input types define the shape of mutation arguments. 'input CreateUserInput { name: String!, email: String! }' generates a separate TypeScript interface. Inputs often have more optional fields than output types since you typically only send the fields you want to update.",
        },
        {
          heading: "Enums and unions",
          body: "GraphQL enums like 'enum Status { ACTIVE, INACTIVE }' can become TypeScript enums or const objects (preferred for tree-shaking). Unions like 'union SearchResult = User | Post' become TypeScript union types: 'type SearchResult = User | Post'. Both preserve the type safety of the original schema.",
        },
        {
          heading: "Interfaces and scalars",
          body: "GraphQL interfaces like 'interface Node { id: ID! }' become TypeScript interfaces that other types can extend. Custom scalars like 'scalar DateTime' need explicit TypeScript type mappings — DateTime typically maps to 'string', JSON to 'Record<string, unknown>', and Upload to 'File'.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between type and input in GraphQL?",
          answer:
            "'type' defines output shapes returned by queries/mutations. 'input' defines argument shapes sent by the client. They generate identical TypeScript interfaces but serve different purposes: types describe what the API returns, inputs describe what the client sends.",
        },
        {
          question: "Should I use TypeScript enums or const objects for GraphQL enums?",
          answer:
            "Const objects (as const) are generally preferred because they tree-shake better, work with string comparisons, and don't generate runtime JavaScript enum objects. TypeScript enums are fine for smaller projects where tree-shaking isn't critical.",
        },
        {
          question: "How do nullable and non-null types map to TypeScript?",
          answer:
            "In GraphQL, fields are nullable by default. 'name: String' means the value can be null. 'name: String!' means it's guaranteed non-null. In TypeScript, nullable fields can be represented as optional properties (name?: string) or explicit union types (name: string | null).",
        },
      ],
      keywords: [
        "graphql types",
        "graphql type system",
        "graphql enum typescript",
        "graphql union type",
        "graphql interface",
        "graphql input type",
        "graphql scalar",
      ],
      parentToolSlug: "graphql-to-typescript",
      parentToolName: "GraphQL to TypeScript Converter",
    },
    {
      slug: "graphql-vs-rest-types",
      title: "GraphQL vs REST: Type Safety Compared",
      metaTitle:
        "GraphQL vs REST Type Safety — How Each Approach Handles TypeScript Types",
      metaDescription:
        "Compare type generation from GraphQL schemas vs OpenAPI/Swagger REST specs. Learn which approach gives better TypeScript type safety and developer experience.",
      h1: "GraphQL vs REST: Type Safety Compared",
      intro:
        "Both GraphQL and REST APIs can generate TypeScript types. Use the converter above for GraphQL schemas, or try the OpenAPI to TypeScript tool for REST APIs.",
      content: [
        {
          heading: "GraphQL: types built into the protocol",
          body: "GraphQL schemas are inherently typed. Every field has a declared type, nullability is explicit, and the schema is the single source of truth. This makes codegen straightforward: parse the SDL, map types to TypeScript, done. The schema guarantees that generated types match the API response shape exactly.",
        },
        {
          heading: "REST + OpenAPI: types as documentation",
          body: "REST APIs don't have built-in types. OpenAPI/Swagger specs add type information as a separate documentation layer. This means types can drift from the actual API behavior. Generated TypeScript types are only as accurate as the OpenAPI spec. Well-maintained specs give comparable type safety to GraphQL.",
        },
        {
          heading: "Developer experience comparison",
          body: "GraphQL codegen tools like @graphql-codegen generate typed hooks (useQuery<GetUserQuery>) that provide end-to-end type safety from schema to component. REST codegen with openapi-typescript generates type-safe fetch wrappers but requires more manual wiring. GraphQL's query-level types mean you only get types for the fields you actually request.",
        },
        {
          heading: "When to use which",
          body: "GraphQL excels when: you have multiple clients needing different data shapes, your API has deeply nested relationships, or you want the strongest possible type safety. REST excels when: your API is simple CRUD, you need HTTP caching, or your team is more familiar with REST patterns. Both can achieve excellent TypeScript type safety with the right tooling.",
        },
      ],
      faqs: [
        {
          question: "Is GraphQL type safety better than REST?",
          answer:
            "GraphQL has inherent type safety because the schema IS the type system. REST APIs achieve comparable type safety through OpenAPI specs, but the spec is separate from the implementation and can drift. GraphQL's advantage is that types are guaranteed to match the API contract.",
        },
        {
          question: "Can I use both GraphQL and REST codegen in one project?",
          answer:
            "Yes. Many projects use GraphQL for complex data-fetching needs and REST for simple endpoints. You can generate TypeScript types from both your GraphQL schema and OpenAPI spec, using them side by side in the same codebase.",
        },
        {
          question: "Which codegen tool should I use for GraphQL?",
          answer:
            "For quick one-off conversions, use this online tool. For build-pipeline integration, @graphql-codegen/cli is the most popular choice with 4.6M+ weekly downloads. It supports plugins for React hooks, Vue composables, and more.",
        },
      ],
      keywords: [
        "graphql vs rest typescript",
        "graphql type safety",
        "rest api typescript",
        "graphql codegen vs openapi",
        "graphql rest comparison",
        "type safe api",
      ],
      parentToolSlug: "graphql-to-typescript",
      parentToolName: "GraphQL to TypeScript Converter",
    },
  ],

  "package-json-generator": [
    {
      slug: "package-json-exports-guide",
      title: "package.json exports Field Guide",
      metaTitle:
        "package.json exports Field Guide — Dual CJS/ESM Packages Explained",
      metaDescription:
        "Learn how to configure the exports field in package.json for dual CJS/ESM packages. Conditional exports, subpath exports, and TypeScript types resolution.",
      h1: "package.json exports Field Guide",
      intro:
        "The exports field is how modern npm packages support both CommonJS and ESM consumers. Use the generator above with the 'exports field' option to see how it works.",
      content: [
        {
          heading: "Why exports matters",
          body: "The exports field replaces main/module/types as the primary entry point mechanism. It provides encapsulation (consumers can only import exported paths), conditional resolution (different code for import vs require), and subpath exports (import 'pkg/utils'). Node.js 12.7+ and all modern bundlers support it.",
        },
        {
          heading: "Conditional exports for dual packages",
          body: "A dual CJS/ESM package uses conditional exports to serve different files. 'import' condition serves ESM (.mjs or .js with type:module), 'require' serves CJS (.cjs or .js with type:commonjs), and 'types' serves TypeScript declarations. Build tools like tsup generate both formats automatically.",
        },
        {
          heading: "Common patterns",
          body: "Single entry: { \".\": { \"types\": \"./dist/index.d.ts\", \"import\": \"./dist/index.mjs\", \"require\": \"./dist/index.cjs\" } }. Subpath exports: { \"./utils\": { \"import\": \"./dist/utils.mjs\" } }. Wildcard: { \"./*\": \"./dist/*.js\" }. Always list 'types' first — TypeScript resolves top-to-bottom.",
        },
        {
          heading: "Migration from main/module",
          body: "Keep main and module alongside exports for backwards compatibility with older Node.js versions and bundlers. exports takes priority when supported. Set types at the top level too for older TypeScript versions. Once you drop Node.js <12.7 support, exports alone is sufficient.",
        },
      ],
      faqs: [
        {
          question: "Do I need both main and exports?",
          answer:
            "For maximum compatibility, yes. exports is used by Node.js 12.7+ and modern bundlers, while main is the fallback for older environments. If you only target modern Node.js (16+), exports alone is fine.",
        },
        {
          question: "What order should conditions be in?",
          answer:
            "TypeScript types should come first, then import, then require, then default. Node.js resolves conditions top-to-bottom and uses the first match. Putting types first ensures TypeScript picks up declarations before runtime conditions.",
        },
        {
          question: "Can I use exports to hide internal files?",
          answer:
            "Yes. Once you add an exports field, only the explicitly exported paths are accessible to consumers. Trying to import an unexported path throws ERR_PACKAGE_PATH_NOT_EXPORTED. This is a key advantage over main/module which exposes the entire package.",
        },
      ],
      keywords: [
        "package.json exports",
        "npm exports field",
        "dual cjs esm package",
        "conditional exports",
        "subpath exports",
        "package.json module",
      ],
      parentToolSlug: "package-json-generator",
      parentToolName: "package.json Generator",
    },
    {
      slug: "npm-scripts-guide",
      title: "npm Scripts Guide",
      metaTitle:
        "npm Scripts Guide — Lifecycle Hooks, Custom Scripts & Best Practices",
      metaDescription:
        "Master npm scripts: lifecycle hooks (pre/post), custom scripts, cross-platform commands, and script composition. Replace Gulp/Grunt with npm scripts.",
      h1: "npm Scripts Guide",
      intro:
        "npm scripts are the standard way to run tasks in Node.js projects. Use the generator above to quickly set up scripts for your project, then customize them here.",
      content: [
        {
          heading: "Built-in lifecycle scripts",
          body: "npm has special script names that run automatically: 'preinstall' and 'postinstall' run before/after npm install, 'prepublishOnly' runs before npm publish (ideal for building), 'prepare' runs after install and before publish. These hooks automate common workflows without manual intervention.",
        },
        {
          heading: "Pre and post hooks",
          body: "Any script can have pre/post hooks. 'prebuild' runs before 'build', 'postbuild' runs after. This lets you chain tasks: prelint → lint → postlint. Common pattern: 'prebuild' cleans the dist folder, 'build' compiles, 'postbuild' runs tests. Pre/post hooks run automatically — you just run 'npm run build'.",
        },
        {
          heading: "Script composition patterns",
          body: "Run scripts in sequence with '&&': \"build\": \"tsc && esbuild ...\". Run in parallel with packages like concurrently or npm-run-all: \"dev\": \"concurrently \\\"tsc -w\\\" \\\"node server.js\\\"\". Reference other scripts: \"ci\": \"npm run lint && npm run test && npm run build\".",
        },
        {
          heading: "Cross-platform compatibility",
          body: "Avoid bash-specific syntax in scripts — Windows users can't run 'rm -rf dist'. Use cross-env for environment variables, rimraf for deletion, and cpy-cli for copying. Or use Node.js scripts directly: \"clean\": \"node -e \\\"require('fs').rmSync('dist',{recursive:true,force:true})\\\"\".",
        },
      ],
      faqs: [
        {
          question: "What is the difference between npm run and npx?",
          answer:
            "'npm run <script>' executes a script defined in package.json. 'npx <command>' runs a package's binary directly, downloading it temporarily if not installed. Use npm scripts for repeatable project tasks, npx for one-off commands.",
        },
        {
          question: "Can I pass arguments to npm scripts?",
          answer:
            "Yes, use -- to separate npm's arguments from the script's arguments: 'npm run test -- --watch' passes --watch to the test command. In npm 7+, you can also use 'npm test -- --watch' for built-in scripts.",
        },
        {
          question: "Should I use npm scripts or a task runner like Gulp?",
          answer:
            "npm scripts are sufficient for most projects and add no extra dependencies. Task runners like Gulp add complexity but offer streaming pipelines and plugin ecosystems. For new projects, start with npm scripts and only add a task runner if you hit limitations.",
        },
      ],
      keywords: [
        "npm scripts",
        "npm run",
        "package.json scripts",
        "npm lifecycle hooks",
        "npm prebuild postbuild",
        "npm script guide",
      ],
      parentToolSlug: "package-json-generator",
      parentToolName: "package.json Generator",
    },
    {
      slug: "esm-vs-commonjs",
      title: "ESM vs CommonJS in package.json",
      metaTitle:
        "ESM vs CommonJS — type: module vs type: commonjs in package.json",
      metaDescription:
        "Understand the difference between ESM and CommonJS in package.json. When to use type: module, how imports change, and how to support both formats.",
      h1: "ESM vs CommonJS in package.json",
      intro:
        "The type field in package.json determines how Node.js treats .js files. Use the generator above to switch between module (ESM) and commonjs (CJS) and see how the output changes.",
      content: [
        {
          heading: "What type: module does",
          body: "Setting \"type\": \"module\" tells Node.js to treat .js files as ES modules. This enables import/export syntax, top-level await, and import.meta. Without it, Node.js treats .js as CommonJS (require/module.exports). You can override per-file with .mjs (always ESM) and .cjs (always CJS).",
        },
        {
          heading: "Key differences in practice",
          body: "ESM: import/export, top-level await, import.meta.url instead of __filename, no require(). CJS: require/module.exports, __filename/__dirname, synchronous loading, JSON import via require(). ESM is strict by default, CJS is sloppy mode. ESM imports are live bindings, CJS exports are value copies.",
        },
        {
          heading: "Migrating from CJS to ESM",
          body: "Steps: 1) Set \"type\": \"module\" in package.json. 2) Rename .js to .mjs for gradual migration, or convert all at once. 3) Replace require() with import. 4) Replace module.exports with export. 5) Replace __dirname with path.dirname(fileURLToPath(import.meta.url)). 6) Add file extensions to relative imports.",
        },
        {
          heading: "Publishing dual-format packages",
          body: "Dual packages support both CJS and ESM consumers. Use the exports field with conditional exports: 'import' points to ESM, 'require' points to CJS. Build tools like tsup, unbuild, or pkgroll generate both formats from the same TypeScript source. Test both entry points before publishing.",
        },
      ],
      faqs: [
        {
          question: "Should new projects use ESM or CommonJS?",
          answer:
            "New projects should use ESM (\"type\": \"module\"). ESM is the JavaScript standard, supported by all modern browsers and Node.js 14+. CJS is legacy. The ecosystem is rapidly moving to ESM-only — major packages like chalk, got, and execa are ESM-only.",
        },
        {
          question: "Can I use require() in an ESM project?",
          answer:
            "Not directly in .js files when type is module. You can use createRequire from the 'module' built-in, or use dynamic import() which works in both ESM and CJS. For JSON files, use import with the assert syntax or createRequire.",
        },
        {
          question: "What if my dependency is CJS-only?",
          answer:
            "ESM can import CJS modules using default import syntax: 'import pkg from \"cjs-package\"'. Named exports may not work — use default import and destructure. This is a Node.js interop feature that makes migration smoother.",
        },
      ],
      keywords: [
        "esm vs commonjs",
        "type module",
        "package.json type",
        "es modules node",
        "commonjs to esm",
        "node esm",
      ],
      parentToolSlug: "package-json-generator",
      parentToolName: "package.json Generator",
    },
  ],

  "security-headers": [
    {
      slug: "hsts-guide",
      title: "HSTS Guide",
      metaTitle:
        "HSTS Guide — Strict-Transport-Security Explained | DevBolt",
      metaDescription:
        "Learn how Strict-Transport-Security (HSTS) works, how to configure max-age, includeSubDomains, and preload, and best practices for deploying HSTS safely.",
      h1: "HSTS Guide — Strict-Transport-Security Explained",
      intro:
        "Strict-Transport-Security (HSTS) tells browsers to always connect via HTTPS. Learn how to configure it correctly, avoid common pitfalls, and submit to browser preload lists.",
      content: [
        {
          heading: "What is HSTS?",
          body: "HTTP Strict-Transport-Security (HSTS) is a response header that instructs browsers to only connect to your site over HTTPS for a specified duration. Once a browser receives the HSTS header, it automatically converts all HTTP requests to HTTPS — even if the user types http:// or clicks an HTTP link. This prevents SSL-stripping attacks where an attacker downgrades connections from HTTPS to HTTP.",
        },
        {
          heading: "Configuring max-age",
          body: "The max-age directive specifies how long (in seconds) the browser should remember to only use HTTPS. Start with a short value (e.g., 300 seconds) to test, then increase to 31536000 (1 year) or 63072000 (2 years) for production. Once set, you cannot easily undo HSTS — browsers will refuse HTTP connections until max-age expires. The minimum recommended value for preload submission is 31536000.",
        },
        {
          heading: "HSTS preload lists",
          body: "Browser preload lists (hstspreload.org) hardcode HSTS for your domain into the browser itself, so even the first visit is protected. Requirements: valid certificate, redirect HTTP to HTTPS, serve HSTS on the root domain with max-age >= 31536000, includeSubDomains, and preload directives. Removal from preload lists can take months, so only submit when you are fully committed to HTTPS.",
        },
      ],
      faqs: [
        {
          question: "Can I undo HSTS once it is set?",
          answer:
            "You can set max-age=0 to tell browsers to stop enforcing HSTS, but users must visit your site again over HTTPS to receive this updated header. If you are on a preload list, removal takes weeks to months. Always test with short max-age values first.",
        },
        {
          question:
            "Should I use includeSubDomains with HSTS?",
          answer:
            "Yes, if all your subdomains support HTTPS. This prevents attackers from using insecure subdomains to set cookies or perform downgrade attacks. It is required for HSTS preload submission.",
        },
        {
          question: "Does HSTS affect performance?",
          answer:
            "HSTS improves performance by eliminating HTTP-to-HTTPS redirects after the first visit. The browser upgrades connections locally without making the initial HTTP request, saving a round trip.",
        },
      ],
      keywords: [
        "hsts guide",
        "strict transport security",
        "hsts header",
        "hsts preload",
        "hsts max-age",
        "http strict transport security",
      ],
      parentToolSlug: "security-headers",
      parentToolName: "Security Headers Generator",
    },
    {
      slug: "security-headers-explained",
      title: "Security Headers Explained",
      metaTitle:
        "HTTP Security Headers Explained — Complete Guide | DevBolt",
      metaDescription:
        "Complete guide to HTTP security headers: HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, COOP, COEP, CORP. Learn what each header does and when to use it.",
      h1: "HTTP Security Headers Explained",
      intro:
        "HTTP security headers are your first line of defense against common web attacks. This guide covers every security header, what it protects against, and recommended values for production.",
      content: [
        {
          heading: "Why security headers matter",
          body: "Security headers instruct browsers to enable built-in security features: blocking XSS (CSP), preventing clickjacking (X-Frame-Options), forcing HTTPS (HSTS), and controlling information leakage (Referrer-Policy). Without them, browsers use permissive defaults that leave your users vulnerable. Adding security headers is one of the highest-impact, lowest-effort security improvements you can make.",
        },
        {
          heading: "Essential headers every site needs",
          body: "At minimum, every website should set: Strict-Transport-Security (force HTTPS), X-Content-Type-Options: nosniff (prevent MIME sniffing), X-Frame-Options: DENY or SAMEORIGIN (prevent clickjacking), and Referrer-Policy: strict-origin-when-cross-origin (control referrer leakage). These four headers cover the most common attack vectors with minimal risk of breaking functionality.",
        },
        {
          heading: "Advanced headers for full protection",
          body: "For maximum security, add: Content-Security-Policy (comprehensive XSS prevention), Permissions-Policy (restrict browser APIs), Cross-Origin-Opener-Policy (isolate browsing context), Cross-Origin-Embedder-Policy (control resource loading), and Cross-Origin-Resource-Policy (prevent cross-origin reads). These require more careful configuration but significantly raise the security bar.",
        },
      ],
      faqs: [
        {
          question: "Which security headers are most important?",
          answer:
            "HSTS, Content-Security-Policy, and X-Content-Type-Options are the most critical. HSTS prevents downgrade attacks, CSP prevents XSS, and X-Content-Type-Options prevents MIME-type confusion attacks. Together they address the majority of common web vulnerabilities.",
        },
        {
          question: "Can security headers break my website?",
          answer:
            "Yes, if misconfigured. CSP is the most likely to cause issues — overly restrictive policies can block legitimate scripts, styles, or images. Start with CSP in report-only mode (Content-Security-Policy-Report-Only) to identify what would be blocked before enforcing.",
        },
        {
          question: "How do I test my security headers?",
          answer:
            "Use browser DevTools (Network tab → response headers), online scanners like securityheaders.com, or curl -I to inspect headers. Test in staging before production, especially for CSP changes.",
        },
      ],
      keywords: [
        "security headers explained",
        "http security headers guide",
        "web security headers",
        "security headers best practices",
        "security headers list",
        "http headers security",
      ],
      parentToolSlug: "security-headers",
      parentToolName: "Security Headers Generator",
    },
    {
      slug: "security-headers-checker",
      title: "Security Headers Checker Guide",
      metaTitle:
        "How to Check Security Headers — Audit Guide | DevBolt",
      metaDescription:
        "Learn how to audit your website's security headers, identify missing protections, and fix common issues. Step-by-step guide with tools and recommended values.",
      h1: "How to Audit Your Security Headers",
      intro:
        "Not sure if your site has the right security headers? This guide walks you through checking your current headers, identifying gaps, and fixing common issues across Nginx, Apache, Vercel, Netlify, and Cloudflare.",
      content: [
        {
          heading: "Checking headers with browser DevTools",
          body: "Open Chrome DevTools (F12) → Network tab → click any request → Headers tab → scroll to Response Headers. Look for Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy. Missing headers mean the browser uses permissive defaults, leaving your site exposed.",
        },
        {
          heading: "Common issues and fixes",
          body: "Missing HSTS: Add Strict-Transport-Security header after confirming HTTPS works on all pages and subdomains. Missing X-Content-Type-Options: Always add nosniff — it has no side effects. X-Frame-Options ALLOW-FROM: Deprecated in most browsers — use CSP frame-ancestors instead. X-XSS-Protection: 1: Deprecated and can introduce vulnerabilities — set to 0 and use CSP.",
        },
        {
          heading: "Platform-specific configuration",
          body: "Nginx: Use add_header directives in server blocks (add 'always' flag for error pages). Apache: Use Header directives in .htaccess or httpd.conf. Vercel: Add headers array in vercel.json. Netlify: Create a _headers file in publish directory. Cloudflare: Use Transform Rules or _headers file with Pages. Each platform has different syntax — use the generator above to get the right format.",
        },
      ],
      faqs: [
        {
          question: "What grade should my security headers get?",
          answer:
            "Aim for an A or A+ grade. This means having at minimum HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and ideally CSP and Permissions-Policy. An A+ requires a strong CSP without unsafe-inline or unsafe-eval.",
        },
        {
          question: "Do CDNs strip security headers?",
          answer:
            "Most CDNs preserve origin headers, but some may strip or override specific headers. Cloudflare preserves all custom headers. AWS CloudFront requires explicit header forwarding. Always verify headers are present after CDN deployment.",
        },
        {
          question:
            "Should I set security headers on API responses too?",
          answer:
            "Yes. APIs should set X-Content-Type-Options: nosniff, Strict-Transport-Security, and a restrictive CSP (default-src 'none'). X-Frame-Options: DENY is also recommended since API responses should never be framed.",
        },
      ],
      keywords: [
        "security headers checker",
        "check security headers",
        "security headers audit",
        "security headers test",
        "missing security headers",
        "fix security headers",
      ],
      parentToolSlug: "security-headers",
      parentToolName: "Security Headers Generator",
    },
  ],
  "typescript-to-js": [
    {
      slug: "type-stripping-guide",
      title: "TypeScript Type Stripping Guide",
      metaTitle:
        "TypeScript Type Stripping Guide — How TS Compiles to JS | DevBolt",
      metaDescription:
        "Learn how TypeScript compiles to JavaScript by stripping types. Understand what gets removed (interfaces, type aliases, generics) and what stays (enums, decorators, class fields).",
      h1: "TypeScript Type Stripping: What Gets Removed and What Stays",
      intro:
        "TypeScript to JavaScript conversion is primarily about removing type annotations. Understanding what gets stripped and what remains helps you write better TypeScript and predict the JavaScript output.",
      content: [
        {
          heading: "What TypeScript removes during compilation",
          body: "TypeScript strips all type-only constructs: interface declarations, type aliases, type annotations on variables and parameters, generic type parameters, type assertions (as Type), access modifiers (public/private/protected), the readonly keyword, implements clauses, declare statements, and non-null assertions (!). These exist only for the type checker and have zero runtime impact.",
        },
        {
          heading: "What TypeScript keeps or transforms",
          body: "Enums are converted to JavaScript objects. Decorators are transformed to function calls. Class fields with initializers are preserved. Optional chaining (?.) and nullish coalescing (??) are kept as-is for modern targets or polyfilled for older targets. Import statements are rewritten based on the module format (CommonJS vs ESM). JSX is either preserved or compiled to React.createElement calls depending on the jsx compiler option.",
        },
        {
          heading: "Type-only imports and exports",
          body: "TypeScript 3.8+ supports 'import type' and 'export type' syntax, which are completely erased during compilation. Regular imports of types are also removed if the compiler can determine they are type-only. This is called 'import elision' and helps produce cleaner JavaScript output with no unused imports.",
        },
      ],
      faqs: [
        {
          question: "Does TypeScript add any runtime code?",
          answer:
            "In most cases, no. TypeScript is a compile-time-only type system. Exceptions: enums generate runtime objects, decorators generate function calls, and downlevel compilation (targeting ES5) may add helper functions for async/await, spread operators, and class features.",
        },
        {
          question: "Can I strip TypeScript types without the full compiler?",
          answer:
            "Yes. Tools like sucrase, esbuild, and SWC perform type stripping without full type checking, which is much faster. Node.js 23.6+ also has experimental --experimental-strip-types flag for native type stripping. This DevBolt tool strips types client-side without any server processing.",
        },
      ],
      keywords: [
        "typescript type stripping",
        "typescript compilation",
        "what typescript removes",
        "typescript to javascript compilation",
        "typescript erasure",
        "strip types typescript",
      ],
      parentToolSlug: "typescript-to-js",
      parentToolName: "TypeScript to JavaScript",
    },
    {
      slug: "ts-vs-js-differences",
      title: "TypeScript vs JavaScript Differences",
      metaTitle:
        "TypeScript vs JavaScript — Key Differences Explained | DevBolt",
      metaDescription:
        "Compare TypeScript and JavaScript — type system, interfaces, enums, generics, and tooling. Learn when to use TypeScript vs plain JavaScript for your project.",
      h1: "TypeScript vs JavaScript: Key Differences for Developers",
      intro:
        "TypeScript extends JavaScript with static types, interfaces, and advanced tooling. Understanding the differences helps you decide when TypeScript adds value and when plain JavaScript is sufficient.",
      content: [
        {
          heading: "Type system: the core difference",
          body: "JavaScript is dynamically typed — variables can hold any value and types are checked at runtime. TypeScript adds optional static typing checked at compile time. You annotate variables (let name: string), function parameters (function greet(name: string)), and return types (function getAge(): number). The type checker catches bugs before code runs, but all types are erased in the output JavaScript.",
        },
        {
          heading: "Interfaces, enums, and generics",
          body: "TypeScript adds constructs that don't exist in JavaScript: interfaces define object shapes for type checking, enums create named constants (compiled to objects), and generics enable reusable type-safe code (function identity<T>(value: T): T). These features make large codebases more maintainable but add a learning curve for JavaScript developers.",
        },
        {
          heading: "When to use TypeScript vs JavaScript",
          body: "Use TypeScript for: large team projects (type contracts prevent integration bugs), library/framework development (consumers get autocomplete), complex business logic (catch errors at compile time), and long-lived codebases (types serve as documentation). Use plain JavaScript for: small scripts, rapid prototyping, learning projects, and environments without build steps (browser consoles, Deno scripts).",
        },
      ],
      faqs: [
        {
          question: "Is TypeScript slower than JavaScript?",
          answer:
            "At runtime, no — TypeScript compiles to plain JavaScript, so execution speed is identical. The compilation step adds build time (typically 1-10 seconds for most projects). Tools like esbuild and SWC make compilation near-instant by skipping type checking.",
        },
        {
          question:
            "Can I use TypeScript and JavaScript in the same project?",
          answer:
            "Yes. TypeScript supports gradual adoption — you can have .ts and .js files in the same project. Set 'allowJs: true' in tsconfig.json. You can incrementally convert files from .js to .ts as you add types.",
        },
      ],
      keywords: [
        "typescript vs javascript",
        "typescript javascript differences",
        "ts vs js",
        "typescript or javascript",
        "when to use typescript",
        "typescript vs javascript comparison",
      ],
      parentToolSlug: "typescript-to-js",
      parentToolName: "TypeScript to JavaScript",
    },
    {
      slug: "migrate-typescript-to-javascript",
      title: "Migrate TypeScript to JavaScript",
      metaTitle:
        "How to Migrate TypeScript to JavaScript — Step-by-Step Guide | DevBolt",
      metaDescription:
        "Step-by-step guide to converting a TypeScript project back to JavaScript. Remove types, rename files, update tooling, and handle edge cases like enums and decorators.",
      h1: "How to Migrate a TypeScript Project to JavaScript",
      intro:
        "Migrating from TypeScript back to JavaScript involves stripping types, renaming files, and updating build tooling. This guide covers the complete process for projects of any size.",
      content: [
        {
          heading: "Step 1: Strip types from all files",
          body: "Use the TypeScript compiler (tsc --outDir dist) to emit JavaScript files, or use a faster tool like esbuild or sucrase for type-only stripping. For individual files, paste them into this converter tool. The key transformation is removing type annotations, interfaces, type aliases, and generics while preserving all runtime code.",
        },
        {
          heading: "Step 2: Handle TypeScript-specific features",
          body: "Some TypeScript features need manual conversion: enums become plain objects or string constants, decorators need a Babel plugin or manual refactoring, namespace declarations become IIFEs or modules, and 'import type' statements are simply deleted. Parameter properties (constructor(public name: string)) must be converted to explicit field assignments.",
        },
        {
          heading: "Step 3: Update project configuration",
          body: "Remove tsconfig.json (or keep it for editor support with 'checkJs'). Update build scripts to remove the tsc step. Rename files from .ts/.tsx to .js/.jsx. Update imports that reference .ts extensions. Remove @types/* devDependencies that are no longer needed. Consider adding JSDoc type annotations for editor support without TypeScript.",
        },
      ],
      faqs: [
        {
          question: "Why would I migrate from TypeScript back to JavaScript?",
          answer:
            "Common reasons: simplifying the build pipeline (especially for small projects), reducing onboarding complexity for new contributors, following a project's decision to use JSDoc types instead, or extracting code for environments without TypeScript support. Some open-source projects (like Svelte) have migrated from TS to JSDoc-typed JS.",
        },
        {
          question: "Can I keep type checking without TypeScript files?",
          answer:
            "Yes. Use JSDoc comments with TypeScript's checkJs option: add // @ts-check at the top of .js files and write types in /** @type {string} */ comments. This gives you type checking in VS Code without .ts files or a build step.",
        },
      ],
      keywords: [
        "migrate typescript to javascript",
        "convert typescript project to javascript",
        "remove typescript from project",
        "typescript to javascript migration",
        "strip types from project",
        "typescript to jsdoc",
      ],
      parentToolSlug: "typescript-to-js",
      parentToolName: "TypeScript to JavaScript",
    },
  ],
  "json-to-sql": [
    {
      slug: "json-to-postgresql",
      title: "JSON to PostgreSQL Converter",
      metaTitle:
        "JSON to PostgreSQL Converter — Generate CREATE TABLE & INSERT | DevBolt",
      metaDescription:
        "Convert JSON arrays to PostgreSQL CREATE TABLE and INSERT statements with automatic type inference for JSONB, UUID, TIMESTAMP, and more. Free online tool.",
      h1: "JSON to PostgreSQL Converter",
      intro:
        "Generate PostgreSQL-compatible SQL from JSON data. This tool automatically infers PostgreSQL-specific types like JSONB, UUID, TIMESTAMP, and DOUBLE PRECISION from your JSON values.",
      content: [
        {
          heading: "Why convert JSON to PostgreSQL?",
          body: "PostgreSQL is the most popular open-source relational database, and developers frequently need to seed tables from JSON API responses, configuration files, or test fixtures. Manually writing CREATE TABLE and INSERT statements is tedious and error-prone. This tool automates the process with proper PostgreSQL syntax, quoting, and type mapping — including advanced types like JSONB for nested objects and UUID for identifier strings.",
        },
        {
          heading: "PostgreSQL type inference",
          body: "The converter detects PostgreSQL-specific types automatically: integers and bigints for numeric values, DOUBLE PRECISION for floats, BOOLEAN for true/false, DATE and TIMESTAMP for date strings, UUID for RFC 4122 identifiers, JSONB for nested objects and arrays, and VARCHAR(n) or TEXT for strings based on length. NULL values are handled with proper nullable column definitions.",
        },
      ],
      faqs: [
        {
          question: "Does the tool generate JSONB columns for nested objects?",
          answer:
            "Yes. When a JSON field contains an object or array value, the tool infers the JSONB type for PostgreSQL. The nested data is serialized as a JSON string in the INSERT statement.",
        },
        {
          question: "Can I use the output directly in psql or pgAdmin?",
          answer:
            "Yes. The generated SQL uses standard PostgreSQL syntax with double-quoted identifiers and proper type names. You can copy it directly into psql, pgAdmin, DBeaver, or any PostgreSQL client.",
        },
      ],
      keywords: [
        "json to postgresql",
        "json to postgres",
        "convert json to postgresql",
        "json to postgres insert",
        "json to postgres create table",
        "postgresql import json",
      ],
      parentToolSlug: "json-to-sql",
      parentToolName: "JSON to SQL Converter",
    },
    {
      slug: "json-to-mysql",
      title: "JSON to MySQL Converter",
      metaTitle:
        "JSON to MySQL Converter — Generate CREATE TABLE & INSERT | DevBolt",
      metaDescription:
        "Convert JSON arrays to MySQL CREATE TABLE and INSERT statements with automatic type inference. Backtick quoting, proper escaping, and .sql download. Free online tool.",
      h1: "JSON to MySQL Converter",
      intro:
        "Generate MySQL-compatible SQL from JSON data. This tool automatically infers MySQL types and uses backtick quoting, proper string escaping, and MySQL-specific syntax.",
      content: [
        {
          heading: "Why convert JSON to MySQL?",
          body: "MySQL powers a huge share of web applications, and importing JSON data into MySQL tables is a common task for seeding databases, migrating data, and creating test fixtures. This tool generates MySQL-specific SQL with backtick-quoted identifiers, VARCHAR/TEXT types with appropriate lengths, and MySQL-compatible boolean handling. It handles the escaping and formatting so you can focus on your data.",
        },
        {
          heading: "MySQL type mapping",
          body: "The converter maps JSON types to MySQL equivalents: INTEGER and BIGINT for numbers, DOUBLE for decimals, BOOLEAN for true/false, DATE and DATETIME for date strings, JSON for nested objects (MySQL 5.7+), and VARCHAR(n) for short strings. String lengths are rounded up to practical sizes to accommodate slight variations in data.",
        },
      ],
      faqs: [
        {
          question: "Does the tool use backtick quoting for MySQL?",
          answer:
            "Yes. All table and column names are wrapped in backticks (`) as is standard MySQL practice. This ensures reserved words and special characters in column names are handled correctly.",
        },
        {
          question: "Is the output compatible with MySQL 5.7 and 8.x?",
          answer:
            "Yes. The generated SQL uses standard MySQL syntax compatible with both MySQL 5.7 and 8.x. JSON column types require MySQL 5.7.8 or later.",
        },
      ],
      keywords: [
        "json to mysql",
        "convert json to mysql",
        "json to mysql insert",
        "json to mysql create table",
        "mysql import json",
        "json to mysql online",
      ],
      parentToolSlug: "json-to-sql",
      parentToolName: "JSON to SQL Converter",
    },
    {
      slug: "json-to-sqlite",
      title: "JSON to SQLite Converter",
      metaTitle:
        "JSON to SQLite Converter — Generate CREATE TABLE & INSERT | DevBolt",
      metaDescription:
        "Convert JSON arrays to SQLite CREATE TABLE and INSERT statements. Lightweight SQL generation with SQLite-compatible types. Free online tool — no signup required.",
      h1: "JSON to SQLite Converter",
      intro:
        "Generate SQLite-compatible SQL from JSON data. This tool produces lightweight CREATE TABLE and INSERT statements using SQLite's flexible type system.",
      content: [
        {
          heading: "Why convert JSON to SQLite?",
          body: "SQLite is the world's most deployed database engine, embedded in mobile apps, desktop software, IoT devices, and development environments. Developers often need to populate SQLite databases from JSON exports, API responses, or configuration data. This tool generates SQLite-compatible SQL with the correct type affinities (TEXT, INTEGER, REAL) and proper quoting.",
        },
        {
          heading: "SQLite type affinities",
          body: "SQLite uses a dynamic type system with five storage classes: NULL, INTEGER, REAL, TEXT, and BLOB. This converter maps JSON booleans to INTEGER (0/1), numbers to INTEGER or REAL, strings to TEXT, and nested objects to TEXT (serialized JSON). Date strings are stored as TEXT since SQLite has no native date type but supports date functions on ISO 8601 strings.",
        },
      ],
      faqs: [
        {
          question: "How does SQLite handle boolean values?",
          answer:
            "SQLite has no native BOOLEAN type. This tool converts JSON booleans to INTEGER values: 1 for true and 0 for false, which is the standard SQLite convention.",
        },
        {
          question:
            "Can I import the generated SQL into an existing SQLite database?",
          answer:
            "Yes. Use the 'IF NOT EXISTS' option to safely create tables without conflicting with existing ones. You can run the SQL file directly with the sqlite3 CLI: sqlite3 mydb.db < output.sql",
        },
      ],
      keywords: [
        "json to sqlite",
        "convert json to sqlite",
        "json to sqlite insert",
        "json to sqlite create table",
        "sqlite import json",
        "json to sqlite online",
      ],
      parentToolSlug: "json-to-sql",
      parentToolName: "JSON to SQL Converter",
    },
  ],
  "json-to-graphql": [
    {
      slug: "graphql-schema-from-api",
      title: "Generate GraphQL Schema from API Response",
      metaTitle:
        "Generate GraphQL Schema from API Response — Free Online Tool | DevBolt",
      metaDescription:
        "Paste a REST API JSON response and generate a complete GraphQL schema with types, queries, and mutations. Free, client-side tool.",
      h1: "Generate GraphQL Schema from API Response",
      intro:
        "Convert any REST API JSON response into a complete GraphQL schema definition. The tool infers types, detects IDs and timestamps, and generates Query and Mutation operations — all in your browser.",
      content: [
        {
          heading: "Why convert JSON to GraphQL?",
          body: "When migrating from REST to GraphQL or wrapping existing REST APIs with a GraphQL layer, you need schema definitions that match your existing data shapes. Manually writing type definitions for complex nested JSON responses is tedious and error-prone. This tool automates the process by analyzing your JSON structure and generating accurate GraphQL types with proper scalar assignments.",
        },
        {
          heading: "How type inference works",
          body: "The generator analyzes each JSON value to determine its GraphQL scalar type: strings become String, integers become Int, floats become Float, booleans become Boolean. Fields named 'id' or ending in '_id' are mapped to the ID scalar. ISO date strings are detected and mapped to custom DateTime or Date scalars. Nested objects become separate GraphQL types, and arrays become list types.",
        },
      ],
      faqs: [
        {
          question: "Does this tool handle nested JSON objects?",
          answer:
            "Yes. Each nested object in your JSON becomes a separate named GraphQL type. Arrays of objects are merged across all elements to produce a complete type with all possible fields.",
        },
        {
          question: "Can I generate Query and Mutation types?",
          answer:
            "Yes. Enable the 'Generate Query' option to add getById and list queries, or 'Generate Mutations' for create, update, and delete operations with automatically generated input types.",
        },
      ],
      keywords: [
        "json to graphql schema",
        "generate graphql from api",
        "rest to graphql converter",
        "json to graphql types",
        "graphql schema from json",
        "api response to graphql",
      ],
      parentToolSlug: "json-to-graphql",
      parentToolName: "JSON to GraphQL Schema Generator",
    },
    {
      slug: "graphql-type-generator",
      title: "GraphQL Type Generator from JSON",
      metaTitle:
        "GraphQL Type Generator from JSON — Free Online Tool | DevBolt",
      metaDescription:
        "Generate GraphQL type definitions from JSON data. Infers scalars, detects IDs, dates, and nested structures. Download as .graphql file.",
      h1: "GraphQL Type Generator from JSON",
      intro:
        "Paste JSON data and get properly structured GraphQL type definitions with inferred scalars, custom scalar declarations, and nested type extraction. Download the schema as a .graphql file.",
      content: [
        {
          heading: "GraphQL scalar types",
          body: "GraphQL has five built-in scalar types: String, Int, Float, Boolean, and ID. The ID type represents a unique identifier and is serialized as a string. For dates and timestamps, GraphQL uses custom scalars like DateTime and Date that must be declared in your schema and implemented in your server's resolver layer.",
        },
        {
          heading: "Non-null types and lists",
          body: "In GraphQL, types are nullable by default. Adding ! makes a field non-null (e.g., name: String!). List types use brackets (e.g., tags: [String!]!). This tool can automatically add non-null markers to fields that have values in every JSON record, helping you build a stricter, more reliable schema.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between type and input in GraphQL?",
          answer:
            "A 'type' defines the shape of data returned by queries. An 'input' defines the shape of data sent to mutations. They look similar but serve different purposes — inputs cannot have fields that return other types, only scalars and other inputs.",
        },
        {
          question: "How do I add custom scalars like DateTime?",
          answer:
            "This tool automatically detects ISO date strings in your JSON and declares custom DateTime and Date scalars in the schema output. On your server, you'll need to provide resolver implementations for these scalars using libraries like graphql-scalars.",
        },
      ],
      keywords: [
        "graphql type generator",
        "generate graphql types",
        "graphql type from json",
        "graphql scalar types",
        "graphql type definition",
        "json to graphql type",
      ],
      parentToolSlug: "json-to-graphql",
      parentToolName: "JSON to GraphQL Schema Generator",
    },
    {
      slug: "graphql-schema-design",
      title: "GraphQL Schema Design Guide",
      metaTitle:
        "GraphQL Schema Design Guide — Best Practices | DevBolt",
      metaDescription:
        "Learn GraphQL schema design best practices: naming conventions, type relationships, nullability, pagination, and error handling patterns.",
      h1: "GraphQL Schema Design Guide",
      intro:
        "Design effective GraphQL schemas with best practices for naming conventions, type relationships, nullability decisions, and common patterns. Use the schema generator above to prototype your types from real data.",
      content: [
        {
          heading: "Naming conventions",
          body: "GraphQL types use PascalCase (User, BlogPost). Fields use camelCase (firstName, createdAt). Enum values use SCREAMING_SNAKE_CASE (PUBLISHED, DRAFT). Input types are conventionally suffixed with 'Input' (CreateUserInput). These conventions are not enforced by the spec but are widely adopted across the ecosystem.",
        },
        {
          heading: "Designing for relationships",
          body: "Unlike REST, GraphQL schemas explicitly model relationships between types. A User type might have a posts: [Post!]! field, and a Post type might have an author: User! field. This bidirectional relationship lets clients query in either direction. Use connection types (edges/nodes pattern) for paginated lists following the Relay specification.",
        },
        {
          heading: "Nullability decisions",
          body: "Making fields non-null (!) is a contract with your clients — you guarantee the field will always have a value. Be conservative: start with nullable fields and only add ! when you are certain the field will never be null. Non-null fields that return null cause the entire parent object to be nullified, which can cascade up the query tree.",
        },
      ],
      faqs: [
        {
          question: "Should I use interfaces or unions in GraphQL?",
          answer:
            "Use interfaces when types share common fields (e.g., Node interface with an id field). Use unions when types are completely different but can appear in the same list (e.g., SearchResult = User | Post | Comment). Interfaces require implementing types to include all interface fields.",
        },
        {
          question: "How should I handle errors in GraphQL schemas?",
          answer:
            "Two common patterns: (1) Use the top-level errors array for unexpected failures. (2) Model expected errors as union types in your schema (e.g., CreateUserResult = User | ValidationError | DuplicateEmailError). The union approach gives clients type-safe error handling.",
        },
      ],
      keywords: [
        "graphql schema design",
        "graphql best practices",
        "graphql naming conventions",
        "graphql schema patterns",
        "graphql type design",
        "graphql nullability",
      ],
      parentToolSlug: "json-to-graphql",
      parentToolName: "JSON to GraphQL Schema Generator",
    },
  ],

  "git-diff-viewer": [
    {
      slug: "unified-diff-format",
      title: "Unified Diff Format Explained",
      metaTitle: "Unified Diff Format Explained — Syntax & Structure Guide | DevBolt",
      metaDescription:
        "Learn the unified diff format used by git diff, patch, and GNU diff. Understand hunk headers, context lines, additions, and deletions with visual examples.",
      h1: "Unified Diff Format Explained",
      intro:
        "The unified diff format is the standard output of git diff and is used by patch tools worldwide. Paste any unified diff into the viewer above to see it rendered with syntax highlighting.",
      content: [
        {
          heading: "What is unified diff format?",
          body: "Unified diff format (also called unidiff) shows changes between two files in a compact, human-readable way. It was introduced by GNU diff and is now the default output format for git diff. Each diff starts with file headers (--- and +++ lines), followed by one or more hunks that show the actual changes with surrounding context lines.",
        },
        {
          heading: "Anatomy of a unified diff",
          body: "A unified diff has several parts: (1) The diff header line starting with 'diff --git a/file b/file'. (2) File metadata lines like 'index abc1234..def5678'. (3) The old file name prefixed with '--- a/'. (4) The new file name prefixed with '+++ b/'. (5) Hunk headers like '@@ -10,7 +10,8 @@' indicating line ranges. (6) Context lines starting with a space. (7) Removed lines starting with '-'. (8) Added lines starting with '+'.",
        },
        {
          heading: "Understanding hunk headers",
          body: "The hunk header @@ -10,7 +10,8 @@ means: in the old file, this hunk starts at line 10 and spans 7 lines; in the new file, it starts at line 10 and spans 8 lines. The numbers after the comma indicate the number of lines shown (context + changes). Some hunks include a function name after the closing @@ for additional context.",
        },
      ],
      faqs: [
        {
          question: "What do the + and - symbols mean in a diff?",
          answer:
            "Lines starting with '-' (minus) were removed from the old version. Lines starting with '+' (plus) were added in the new version. Lines starting with a space are unchanged context lines shown for reference. Lines starting with '@@' are hunk headers indicating line positions.",
        },
        {
          question: "What is the difference between unified and context diff format?",
          answer:
            "Unified diff (git diff default) shows changes inline with +/- prefixes and is more compact. Context diff (diff -c) shows old and new versions in separate blocks marked with *** and ---. Unified format is preferred for code review and version control because it is more readable and produces smaller patches.",
        },
      ],
      keywords: [
        "unified diff format",
        "diff format explained",
        "git diff format",
        "unified diff syntax",
        "diff hunk header",
        "patch file format",
      ],
      parentToolSlug: "git-diff-viewer",
      parentToolName: "Git Diff Viewer",
    },
    {
      slug: "git-diff-guide",
      title: "Git Diff Command Guide",
      metaTitle: "Git Diff Command Guide — Options, Flags & Examples | DevBolt",
      metaDescription:
        "Complete guide to the git diff command. Learn git diff options, compare branches, staged changes, specific files, and generate patches. Free examples and cheat sheet.",
      h1: "Git Diff Command Guide",
      intro:
        "Master the git diff command with practical examples. Generate diff output and paste it into the viewer above to see it rendered with syntax highlighting and line numbers.",
      content: [
        {
          heading: "Basic git diff usage",
          body: "Running 'git diff' with no arguments shows unstaged changes in your working directory compared to the index (staging area). Use 'git diff --staged' (or --cached) to see changes that are staged for the next commit. Use 'git diff HEAD' to see all changes (staged and unstaged) compared to the last commit.",
        },
        {
          heading: "Comparing branches and commits",
          body: "Compare two branches: 'git diff main..feature-branch'. Compare a specific commit to HEAD: 'git diff abc1234..HEAD'. Show changes introduced by a single commit: 'git diff abc1234^..abc1234' or simply 'git show abc1234'. Compare specific files: 'git diff main -- src/app.ts'. Use 'git diff --stat' for a summary of changed files without full content.",
        },
        {
          heading: "Useful git diff flags",
          body: "Common flags include: --stat (file change summary), --name-only (list changed file names), --name-status (names with A/M/D status), --word-diff (word-level differences), --color-words (inline word-level coloring), -U5 (show 5 context lines instead of default 3), --ignore-space-change (-b, ignore whitespace changes), and --diff-filter=M (show only modified files).",
        },
      ],
      faqs: [
        {
          question: "How do I see what changed in the last commit?",
          answer:
            "Use 'git diff HEAD~1..HEAD' to compare the last commit with the one before it. Alternatively, 'git show' displays the diff for the most recent commit along with its commit message. For a specific commit, use 'git show <commit-hash>'.",
        },
        {
          question: "How do I generate a patch file from git diff?",
          answer:
            "Run 'git diff > changes.patch' to save the diff to a file. Apply it later with 'git apply changes.patch'. For commits, use 'git format-patch -1 HEAD' to create a patch file with commit metadata. Patches can be shared via email or file transfer and applied with 'git am'.",
        },
      ],
      keywords: [
        "git diff command",
        "git diff guide",
        "git diff examples",
        "git diff options",
        "git diff branches",
        "git diff staged",
      ],
      parentToolSlug: "git-diff-viewer",
      parentToolName: "Git Diff Viewer",
    },
    {
      slug: "side-by-side-diff-viewer",
      title: "Side-by-Side Diff Viewer",
      metaTitle: "Side-by-Side Diff Viewer Online — Compare Code Changes | DevBolt",
      metaDescription:
        "View git diffs side by side online. Paste unified diff output and see old and new versions displayed in parallel columns with syntax highlighting and line numbers.",
      h1: "Side-by-Side Diff Viewer Online",
      intro:
        "View your git diff output in a side-by-side layout with the old version on the left and new version on the right. Paste any unified diff above and switch to Side by Side view mode.",
      content: [
        {
          heading: "Why use side-by-side diff view?",
          body: "Side-by-side diff view displays the old and new file versions in parallel columns, making it easier to see exactly what changed at each line. It is the preferred view for code reviews because you can scan corresponding lines horizontally. Inline view is better for small changes or narrow screens, while side-by-side excels for refactoring and multi-line changes.",
        },
        {
          heading: "How to read a side-by-side diff",
          body: "In side-by-side view, the left column shows the original file and the right column shows the modified version. Deleted lines appear highlighted in red on the left with an empty slot on the right. Added lines appear highlighted in green on the right with an empty slot on the left. Modified lines show the old version in red (left) and new version in green (right) on the same row.",
        },
      ],
      faqs: [
        {
          question: "When should I use side-by-side vs inline diff view?",
          answer:
            "Use side-by-side view for code reviews, refactoring comparisons, and when you need to see old and new versions simultaneously. Use inline view on narrow screens, for small single-line changes, or when you want a compact view of the diff. Most code review tools default to side-by-side for desktop and inline for mobile.",
        },
        {
          question: "Can I use side-by-side view with any diff format?",
          answer:
            "This tool accepts unified diff format (the output of git diff). Paste your diff text and select 'Side by Side' from the view dropdown. The viewer automatically pairs deleted and added lines for parallel display. Context lines appear on both sides.",
        },
      ],
      keywords: [
        "side by side diff",
        "side by side diff viewer",
        "compare code side by side",
        "parallel diff view",
        "split diff viewer",
        "diff viewer online",
      ],
      parentToolSlug: "git-diff-viewer",
      parentToolName: "Git Diff Viewer",
    },
  ],
};
