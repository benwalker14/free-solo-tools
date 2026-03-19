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
};
