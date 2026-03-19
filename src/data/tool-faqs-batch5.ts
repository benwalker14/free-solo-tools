import type { FAQ } from "./tool-faqs";

export const toolFaqsBatch5: Record<string, FAQ[]> = {
  "css-to-tailwind": [
    {
      question: "How do I convert CSS to Tailwind utility classes?",
      answer:
        "Paste your CSS code into the input panel and the converter instantly maps each property to its Tailwind equivalent. The tool handles over 100 CSS properties including layout (display, position, flex, grid), spacing (margin, padding, gap), typography (font-size, font-weight, line-height), colors, borders, shadows, and transforms. Properties with exact Tailwind matches produce standard utility classes, while custom values generate arbitrary value syntax like w-[37px]. The output shows each CSS rule converted to a space-separated list of Tailwind classes you can copy directly into your HTML or JSX className attribute.",
    },
    {
      question: "What CSS properties does the Tailwind converter support?",
      answer:
        "The converter supports all commonly used CSS properties that have Tailwind equivalents. This includes display, position, width, height, min/max dimensions, margin, padding, gap, flex and grid properties, font-size, font-weight, font-family, line-height, letter-spacing, text-align, text-transform, color, background-color, border properties, border-radius, box-shadow, opacity, overflow, z-index, cursor, transition, transform, and animation. When a CSS value matches a Tailwind design token exactly, you get a clean utility class. For non-standard values, the tool uses Tailwind's arbitrary value syntax enclosed in square brackets.",
    },
    {
      question: "What is the difference between Tailwind arbitrary values and custom theme extensions?",
      answer:
        "Arbitrary values use bracket syntax like text-[17px] or bg-[#1a2b3c] to apply one-off values inline without configuring your theme. Custom theme extensions are defined in tailwind.config.js under the extend key, creating reusable design tokens like text-brand or spacing-header. Use arbitrary values for truly unique, non-repeating values. Use theme extensions when a value appears multiple times across your codebase to maintain consistency and reduce duplication. The converter outputs arbitrary values by default since it cannot know your project's theme configuration, but you should refactor repeated arbitrary values into theme tokens.",
    },
  ],
  "json-visualizer": [
    {
      question: "How do I navigate large JSON files in the tree viewer?",
      answer:
        "The tree viewer renders JSON as a hierarchical structure with collapsible nodes for objects and arrays. Click any node to expand or collapse its children. Use the collapse-all button to reset the tree, then selectively expand the sections you need. The search feature lets you filter by key name or value, highlighting matches and auto-expanding parent nodes to reveal results. For deeply nested structures, the breadcrumb path display shows your current location. You can also click any node to copy its JSON path (like $.data.users[0].name) to the clipboard for use in code or JSONPath queries.",
    },
    {
      question: "What is the difference between JSON tree view and raw JSON?",
      answer:
        "Raw JSON is the plain text representation with curly braces, brackets, and commas. A JSON tree view renders that same data as a visual hierarchy where each key-value pair is a row, objects and arrays become expandable nodes, and data types are color-coded. Tree view makes it easier to understand structure at a glance, especially for deeply nested data. You can collapse irrelevant sections to focus on specific parts. Raw JSON is better for editing, copying, and machine processing. Most developers use tree view for exploration and debugging, then switch to raw view when they need to modify or extract the actual JSON text.",
    },
    {
      question: "How do I copy a specific JSON path from the visualizer?",
      answer:
        "Click on any key or value in the tree view to select that node. The tool displays the full JSON path in dot notation (like data.users[0].email) in the path bar at the top. Click the copy button next to the path to copy it to your clipboard. This path can be used directly in JavaScript with libraries like lodash's _.get(), in JSONPath expressions, or in jq filters. For array elements, the path includes the numeric index. This feature is particularly useful when working with API responses where you need to reference a specific nested field in your code or documentation.",
    },
  ],
  "svg-to-jsx": [
    {
      question: "How does SVG to JSX conversion work?",
      answer:
        "The converter transforms standard SVG markup into valid JSX by applying React's attribute naming rules. HTML attributes like class become className, for becomes htmlFor, and all hyphenated attributes convert to camelCase (stroke-width becomes strokeWidth, fill-opacity becomes fillOpacity). Inline style strings are parsed into JavaScript objects with camelCase properties. The xmlns attribute is removed since React handles it automatically. You can optionally wrap the output in a React component with forwardRef for ref passing, React.memo for performance optimization, and TypeScript SVGProps typing for full type safety.",
    },
    {
      question: "What is the difference between SVG in HTML and SVG in JSX?",
      answer:
        "SVG in HTML uses standard XML/HTML attributes like stroke-width, fill-rule, clip-path, and class. SVG in JSX requires React's camelCase convention, so these become strokeWidth, fillRule, clipPath, and className. The style attribute in HTML takes a CSS string like \"fill: red; opacity: 0.5\" but in JSX requires a JavaScript object like {{ fill: 'red', opacity: 0.5 }}. Event handlers change from lowercase (onclick) to camelCase (onClick). Boolean attributes need explicit values in JSX. These differences cause React console warnings or rendering failures if you paste raw SVG directly into JSX without conversion.",
    },
    {
      question: "How do I create a reusable React component from an SVG icon?",
      answer:
        "Paste your SVG code and enable the component output option. The converter generates a named React function component that accepts standard SVG props like width, height, fill, and className. Enable forwardRef to allow parent components to access the underlying SVG DOM element. Enable memo to prevent unnecessary re-renders when props have not changed. For TypeScript projects, the component is typed with React.SVGProps<SVGSVGElement> so you get full autocomplete for all valid SVG attributes. The generated component spreads incoming props onto the root SVG element, letting consumers override default values like size and color.",
    },
  ],
  "prompt-builder": [
    {
      question: "How do I structure an effective AI prompt?",
      answer:
        "An effective AI prompt has four key sections: role or system context that defines the AI's persona and constraints, task description that clearly states what you want, input data or context the AI needs to work with, and output format specifying the expected response structure. The prompt builder provides templates for each section and lets you combine them into a complete prompt. Being specific about format (JSON, markdown, bullet points) dramatically improves output consistency. Including examples of desired output (few-shot prompting) further improves accuracy. Constraints like word limits, tone requirements, or topics to avoid help keep responses focused and useful.",
    },
    {
      question: "What is the difference between system prompts and user prompts?",
      answer:
        "System prompts set the AI's behavior, persona, and constraints for an entire conversation. They are processed before any user messages and establish rules the model follows throughout the session. User prompts are the individual messages containing questions, tasks, or data. In the OpenAI API, these map to the system and user roles in the messages array. Anthropic uses a dedicated system parameter separate from the messages. System prompts are ideal for persistent instructions like output format, tone, domain expertise, and safety guardrails. User prompts handle the specific request for each turn. Combining both effectively gives you consistent, well-structured AI responses.",
    },
    {
      question: "How do I format prompts for the OpenAI and Anthropic APIs?",
      answer:
        "OpenAI's Chat Completions API expects a messages array with objects containing role (system, user, or assistant) and content fields. The system message goes first, followed by alternating user and assistant messages. Anthropic's Messages API uses a separate top-level system parameter for system instructions and a messages array with user and assistant roles only. Both APIs support multi-turn conversations by including message history. The prompt builder formats your content for either API, generating the correct JSON structure you can copy directly into your API call. Temperature, max_tokens, and model parameters are set alongside the messages.",
    },
  ],
  "mcp-config-builder": [
    {
      question: "What is an MCP config file and how does it work?",
      answer:
        "An MCP (Model Context Protocol) config file defines external tool servers that AI assistants can connect to. It specifies server entries with transport type (stdio or SSE), the command to launch each server, environment variables, and optional arguments. Claude Desktop reads from claude_desktop_config.json, Cursor uses .cursor/mcp.json, VS Code uses .vscode/mcp.json, and Claude Code uses .mcp.json in the project root. Each entry tells the AI client how to start and communicate with a tool server, giving the model access to capabilities like file system operations, database queries, API calls, and custom business logic tools.",
    },
    {
      question: "What is the difference between stdio and SSE MCP transports?",
      answer:
        "Stdio transport launches the MCP server as a local child process and communicates through standard input/output streams. The AI client starts the server command, sends JSON-RPC messages to stdin, and reads responses from stdout. This is the most common transport for local tools. SSE (Server-Sent Events) transport connects to a remote MCP server over HTTP. The client sends requests via HTTP POST and receives responses through an SSE event stream. Use stdio for locally installed tools and development servers. Use SSE for shared remote servers, cloud-hosted tools, or when the server needs to run independently of the AI client.",
    },
    {
      question: "How do I add environment variables to an MCP server config?",
      answer:
        "In the MCP config JSON, each server entry supports an env object where you define key-value pairs for environment variables passed to the server process. For example, a GitHub MCP server needs GITHUB_TOKEN, and a database server needs DATABASE_URL. The builder provides fields to add these variables per server. Sensitive values like API keys and tokens should be set in the config but never committed to version control. For Claude Desktop on macOS, the config lives at ~/Library/Application Support/Claude/claude_desktop_config.json. On Windows, it is in %APPDATA%/Claude/. Add the config file to your .gitignore to protect secrets.",
    },
  ],
  "openapi-to-typescript": [
    {
      question: "How do I convert an OpenAPI spec to TypeScript interfaces?",
      answer:
        "Paste your OpenAPI 3.x or Swagger 2.0 JSON/YAML specification into the input panel. The converter parses the schema definitions (components/schemas in OpenAPI 3.x or definitions in Swagger 2.0) and generates TypeScript interfaces for each model. It maps JSON Schema types to TypeScript types: string, number, boolean, arrays become typed arrays, and nested objects become separate interfaces with references. Required fields become non-optional properties while others get the optional (?) modifier. Enum values generate TypeScript union types or enum declarations. The output includes all referenced types so you get a complete, self-contained set of type definitions.",
    },
    {
      question: "What is the difference between OpenAPI 3.0 and Swagger 2.0?",
      answer:
        "Swagger 2.0 is the older specification format where schemas live under a top-level definitions key, security uses securityDefinitions, and request bodies are defined as body parameters. OpenAPI 3.0 reorganized the structure: schemas moved to components/schemas, introduced a dedicated requestBody object, added support for multiple servers, and improved content type handling with a content/mediaType pattern. OpenAPI 3.0 also supports oneOf, anyOf, and allOf more explicitly for schema composition. The converter handles both formats transparently, detecting the version from the swagger or openapi field and mapping the schemas to TypeScript interfaces using the same output format regardless of input version.",
    },
    {
      question: "How are nullable and optional fields handled in the generated TypeScript?",
      answer:
        "Fields listed in the schema's required array become mandatory TypeScript properties, while unlisted fields get the optional modifier (?). For nullable fields, OpenAPI 3.0 uses nullable: true which generates a union type with null (for example, string | null). OpenAPI 3.1 uses type arrays like [\"string\", \"null\"] which produce the same union. Swagger 2.0 has no native nullable support, so x-nullable extensions are checked. When a field is both optional and nullable, the output is something like description?: string | null, meaning the property may be absent or explicitly set to null. This distinction matters for strict TypeScript configurations with strictNullChecks enabled.",
    },
  ],
  "json-to-zod": [
    {
      question: "How do I generate a Zod schema from JSON data?",
      answer:
        "Paste a JSON object or array into the input and the tool infers the Zod schema from the data structure and value types. Strings become z.string(), numbers become z.number(), booleans become z.boolean(), null becomes z.null(), arrays become z.array() with the inferred element type, and nested objects become z.object() with their own properties. You can also input a JSON Schema document for more precise conversion, since JSON Schema includes constraints like minLength, pattern, minimum, and maximum that map directly to Zod methods like .min(), .max(), and .regex(). The generated schema is ready to import into any TypeScript project using Zod.",
    },
    {
      question: "What is Zod and why use it for runtime validation?",
      answer:
        "Zod is a TypeScript-first schema declaration and validation library. Unlike TypeScript types that only exist at compile time and are erased in production JavaScript, Zod schemas validate data at runtime. This is essential for validating API responses, form inputs, environment variables, and any external data entering your application. Zod schemas also infer TypeScript types with z.infer<typeof schema>, so you define your validation once and get both runtime checks and compile-time types from a single source of truth. This eliminates the common bug where TypeScript types and runtime validation logic drift apart. Zod integrates with popular form libraries like React Hook Form and server frameworks like tRPC.",
    },
    {
      question: "How do I add custom constraints to generated Zod schemas?",
      answer:
        "The generated schema provides the base structure which you can extend with Zod's built-in validation methods. Chain .min() and .max() on strings and numbers for length and range constraints. Use .email(), .url(), .uuid(), and .regex() for string format validation. Add .optional() to make fields not required, or .nullable() to allow null values. Use .default() to set fallback values. For arrays, chain .nonempty(), .min(), or .max() to constrain length. Use .refine() for custom validation logic that Zod does not cover natively, like checking that a password confirmation matches. If you input a JSON Schema with constraints already defined, these methods are generated automatically.",
    },
  ],
  "jwt-builder": [
    {
      question: "How do I build and sign a JWT token?",
      answer:
        "Select your signing algorithm (HMAC-SHA256 is the most common), then configure the payload claims in the visual editor. Standard claims include sub (subject identifier), iss (token issuer), aud (intended audience), exp (expiration time), iat (issued at), and nbf (not valid before). Add any custom claims your application needs. Enter your signing secret for HMAC algorithms or your private key for RSA and ECDSA. The tool generates the three-part JWT: Base64url-encoded header, Base64url-encoded payload, and cryptographic signature. The complete token is ready to copy and use in Authorization headers or API testing tools.",
    },
    {
      question: "What is the difference between HMAC, RSA, and ECDSA JWT algorithms?",
      answer:
        "HMAC (HS256, HS384, HS512) uses a single shared secret for both signing and verification. It is the simplest option and works well when the same service creates and validates tokens. RSA (RS256, RS384, RS512) uses asymmetric key pairs where the private key signs and the public key verifies. This allows one service to issue tokens while others verify without knowing the private key. ECDSA (ES256, ES384, ES512) also uses asymmetric keys but with elliptic curve cryptography, producing significantly smaller signatures than RSA with equivalent security strength. Choose HMAC for single-service scenarios, RSA for distributed systems, and ECDSA when token size matters.",
    },
    {
      question: "How do I set JWT expiration time correctly?",
      answer:
        "The exp claim is a Unix timestamp (seconds since January 1, 1970 UTC) representing when the token becomes invalid. The builder lets you set expiration as a duration from now (like 1 hour, 24 hours, or 7 days) and calculates the timestamp automatically. Short-lived tokens (15-60 minutes) are more secure because a stolen token has limited usefulness. Pair short access tokens with longer-lived refresh tokens to maintain sessions without frequent logins. The iat (issued at) claim records when the token was created, and nbf (not before) can delay when the token becomes valid. Always validate exp server-side and reject expired tokens even if the signature is valid.",
    },
  ],
  "tsconfig-builder": [
    {
      question: "How do I create a tsconfig.json for my project?",
      answer:
        "Select a framework preset (React, Next.js, Node.js, library, or vanilla TypeScript) to start with recommended defaults, then customize individual options using the visual editor. Each compiler option shows a description explaining what it does and when to enable it. The builder organizes options into categories: strict type checking, module resolution, output settings, path aliases, and file inclusion. Common configurations include setting target and module for your runtime environment, enabling strict mode for maximum type safety, and configuring paths for import aliases. The generated tsconfig.json updates in real time as you toggle options and can be copied or downloaded.",
    },
    {
      question: "What does strict mode enable in TypeScript?",
      answer:
        "The strict flag is a shorthand that enables a collection of stricter type-checking options. It turns on strictNullChecks (null and undefined are distinct types), strictFunctionTypes (stricter function parameter checking), strictBindCallApply (type-safe bind, call, apply), strictPropertyInitialization (class properties must be initialized), noImplicitAny (error on inferred any types), noImplicitThis (error on this with implicit any type), useUnknownInCatchVariables (catch variables typed as unknown), and alwaysStrict (emits use strict in output). Enabling strict is strongly recommended for all new projects. It catches common bugs at compile time and forces explicit type handling rather than relying on implicit any types.",
    },
    {
      question: "What is the difference between module and moduleResolution in tsconfig?",
      answer:
        "The module option controls the JavaScript module format TypeScript emits in compiled output. Values include commonjs (require/module.exports), esnext or es2022 (import/export), and nodenext (Node.js native ESM with package.json type detection). The moduleResolution option controls how TypeScript finds and resolves import statements to actual files. Values include node (Node.js CommonJS resolution), node16 or nodenext (Node.js ESM resolution with exports field support), and bundler (modern bundler resolution like webpack or Vite that supports package.json exports without requiring file extensions). These are independent settings: you can emit ESM modules while using bundler resolution if a bundler processes your output.",
    },
  ],
  "graphql-to-typescript": [
    {
      question: "How do I convert a GraphQL schema to TypeScript types?",
      answer:
        "Paste your GraphQL SDL (Schema Definition Language) into the input panel. The converter maps GraphQL types to TypeScript equivalents: type becomes an interface, input becomes an interface, enum becomes a TypeScript enum or union type, scalar maps to its JavaScript equivalent (String to string, Int and Float to number, Boolean to boolean, ID to string). Nullable fields (the default in GraphQL) become optional TypeScript properties or union types with null. Non-null fields marked with ! become required properties. Union types and interfaces generate TypeScript union types. The output produces a complete set of type definitions that match your GraphQL schema structure.",
    },
    {
      question: "What is the difference between GraphQL types and TypeScript interfaces?",
      answer:
        "GraphQL types define the shape of data in your API schema. They specify fields, arguments, return types, and nullability for queries, mutations, and subscriptions. TypeScript interfaces define the shape of objects in your code at compile time. The key difference is nullability defaults: GraphQL fields are nullable by default and require ! to mark as non-null, while TypeScript properties are required by default and use ? to mark as optional. GraphQL also has concepts without direct TypeScript equivalents, like directives, arguments on fields, and resolvers. The converter generates TypeScript interfaces representing the data shapes, which you use to type API responses, variables, and resolver functions in your TypeScript codebase.",
    },
    {
      question: "How are GraphQL enums converted to TypeScript?",
      answer:
        "GraphQL enums like enum Status { ACTIVE, INACTIVE, PENDING } can be converted to either TypeScript enums or string union types. As a TypeScript enum: enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE', Pending = 'PENDING' }. As a union type: type Status = 'ACTIVE' | 'INACTIVE' | 'PENDING'. Union types are generally preferred in modern TypeScript because they produce no runtime JavaScript code, work naturally with string comparisons, and have better type inference. TypeScript enums generate runtime objects and can behave unexpectedly with numeric values. The converter lets you choose between both output styles based on your project conventions.",
    },
  ],
  "package-json-generator": [
    {
      question: "How do I create a package.json file for a new project?",
      answer:
        "Select a framework preset (React, Next.js, Express, library, or CLI tool) to populate common dependencies, scripts, and configuration fields. Then customize the package name, version, description, entry points (main, module, types for libraries), and scripts. The dependency editor lets you add, remove, and set version ranges for both dependencies and devDependencies. Common scripts like dev, build, test, and lint are pre-configured based on your chosen preset. The generator also handles metadata fields like license, repository, author, keywords, and engines for Node.js version requirements. The output is a valid package.json file ready to download or copy.",
    },
    {
      question: "What is the difference between dependencies and devDependencies?",
      answer:
        "Dependencies are packages required at runtime when your application or library runs in production. Examples include React, Express, lodash, and database drivers. devDependencies are packages only needed during development, testing, and building. Examples include TypeScript, ESLint, Prettier, Jest, and build tools like Vite or webpack. When someone installs your published npm package, only dependencies are installed, not devDependencies. Running npm install in a project installs both. Running npm install --production or setting NODE_ENV=production skips devDependencies. Placing packages in the correct category reduces production bundle size and install time. If in doubt, ask: does the running application import this package directly?",
    },
    {
      question: "How do I configure exports and entry points in package.json?",
      answer:
        "Modern packages use the exports field to define public entry points with conditional resolution. The main field points to the CommonJS entry (dist/index.cjs), module points to the ESM entry (dist/index.mjs), and types points to TypeScript declarations (dist/index.d.ts). The exports field provides finer control: set \".\" for the main entry, \"./utils\" for subpath exports, and use conditions like import, require, and types for format-specific resolution. Setting \"type\": \"module\" makes .js files treated as ESM by default. For TypeScript libraries, include a types condition in exports so consumers get type definitions automatically. The generator configures these fields correctly based on your selected output format.",
    },
  ],
  "security-headers": [
    {
      question: "What HTTP security headers should every website have?",
      answer:
        "Every website should set these core security headers: Content-Security-Policy (CSP) to control which resources can load, preventing XSS attacks. Strict-Transport-Security (HSTS) to force HTTPS connections. X-Content-Type-Options set to nosniff to prevent MIME type sniffing. X-Frame-Options set to DENY or SAMEORIGIN to prevent clickjacking. Referrer-Policy to control what URL information is sent to other sites. Permissions-Policy to disable unused browser features like camera, microphone, and geolocation. These headers add defense-in-depth layers that protect users even if your application code has vulnerabilities. The generator produces correctly formatted header configurations for your specific web server or hosting platform.",
    },
    {
      question: "How do I configure Content-Security-Policy headers?",
      answer:
        "Content-Security-Policy (CSP) is a whitelist of allowed content sources for your page. Define directives for each resource type: default-src as the fallback, script-src for JavaScript, style-src for CSS, img-src for images, connect-src for fetch/XHR, font-src for fonts, and frame-src for iframes. Start with a restrictive policy like default-src 'self' which only allows resources from your own domain. Add specific sources as needed: CDN domains for third-party scripts, 'unsafe-inline' for inline styles (avoid for scripts), and data: for base64-encoded resources. Use report-uri or report-to to receive violation reports during rollout. The generator builds the policy string from your selected directives.",
    },
    {
      question: "What is the difference between security header configs for Nginx and Vercel?",
      answer:
        "Nginx uses the add_header directive in server or location blocks within nginx.conf. Each header is a separate add_header line like add_header X-Frame-Options \"DENY\". Vercel uses a headers array in vercel.json where each entry specifies a source path pattern and an array of key-value header objects. Apache uses the Header set directive in .htaccess or httpd.conf. Cloudflare can set headers via Page Rules or _headers file. The actual header names and values are identical across all platforms. Only the configuration syntax differs. The generator outputs the exact configuration format for your chosen platform so you can copy it directly into your deployment configuration without manual syntax translation.",
    },
  ],
  "typescript-to-js": [
    {
      question: "How does TypeScript to JavaScript conversion work?",
      answer:
        "The converter strips all TypeScript-specific syntax from your code, producing valid JavaScript. Type annotations (: string, : number) are removed from variables, parameters, and return types. Interface and type declarations are deleted entirely since they have no runtime equivalent. Generics (<T>) are removed from function and class definitions. Enum declarations are converted to plain JavaScript objects or constants. Access modifiers (public, private, protected) are stripped from class members. The as keyword for type assertions is removed. Non-null assertions (!) are removed. Optional chaining (?.) and nullish coalescing (??) are preserved since they are valid JavaScript syntax. The output is clean, runnable JavaScript.",
    },
    {
      question: "What happens to TypeScript enums when converted to JavaScript?",
      answer:
        "TypeScript enums are one of the few TypeScript features that emit runtime JavaScript code. Numeric enums like enum Direction { Up, Down } become an immediately invoked function that creates a bidirectional mapping object where both Direction[0] returns \"Up\" and Direction[\"Up\"] returns 0. String enums like enum Color { Red = 'red' } become a simpler object mapping. Const enums declared with const enum are inlined at usage sites and produce no runtime object at all, so they are fully removed during conversion. The converter reproduces the same JavaScript output that the TypeScript compiler would generate, ensuring identical runtime behavior.",
    },
    {
      question: "What is the difference between TypeScript type stripping and transpilation?",
      answer:
        "Type stripping removes only TypeScript type syntax (annotations, interfaces, type aliases, generics) while preserving all JavaScript code exactly as written. The output matches the input structurally with types erased. Transpilation goes further by also transforming JavaScript syntax for older runtime targets: converting async/await to promises, optional chaining to ternary checks, class fields to constructor assignments, and modern syntax to equivalent older patterns. This tool performs type stripping by default, which is sufficient when your target runtime supports modern JavaScript. Node.js 22+ has native type stripping built in, meaning it can run TypeScript files directly by simply ignoring type annotations.",
    },
  ],
  "json-to-sql": [
    {
      question: "How do I convert JSON data to SQL INSERT statements?",
      answer:
        "Paste a JSON array of objects into the input panel. The converter analyzes the keys and value types across all objects to infer column names and SQL data types. It generates a CREATE TABLE statement with appropriate column types (VARCHAR for strings, INTEGER or NUMERIC for numbers, BOOLEAN, TIMESTAMP for date strings) and INSERT INTO statements for each row. You can select your target database dialect (PostgreSQL, MySQL, or SQLite) since they differ in type names, quoting rules, and syntax. String values are automatically escaped to prevent SQL injection in the generated output. Null JSON values produce SQL NULL literals in the corresponding INSERT columns.",
    },
    {
      question: "What is the difference between PostgreSQL, MySQL, and SQLite data types?",
      answer:
        "PostgreSQL uses rich types like TEXT (unlimited strings), INTEGER, BIGINT, NUMERIC (precise decimals), BOOLEAN, TIMESTAMP WITH TIME ZONE, JSONB (indexed JSON), and UUID. MySQL uses VARCHAR(255) for strings (requiring length), INT, BIGINT, DECIMAL, TINYINT(1) for booleans, DATETIME, JSON, and CHAR(36) for UUIDs. SQLite has only five storage classes: TEXT, INTEGER, REAL, BLOB, and NULL with dynamic typing that accepts any value in any column. The converter maps JSON types to the most appropriate native type for each dialect. Numbers without decimals become INTEGER, numbers with decimals become NUMERIC or DECIMAL, and ISO date strings become TIMESTAMP or DATETIME.",
    },
    {
      question: "How are nested JSON objects handled in SQL conversion?",
      answer:
        "Nested JSON objects and arrays cannot be directly mapped to flat SQL columns in traditional relational fashion. The converter offers two approaches. The first serializes nested values as JSON strings stored in a JSON or TEXT column, preserving the full structure. PostgreSQL's JSONB and MySQL's JSON types support querying into these values. The second approach flattens one level of nesting by creating separate columns with dot-notation names like address_city and address_zip. Arrays of primitive values are serialized as JSON strings. For deeply nested structures, consider normalizing the data into multiple related tables manually, as automated flattening beyond one level produces unwieldy schemas.",
    },
  ],
  "json-to-graphql": [
    {
      question: "How do I generate a GraphQL schema from JSON data?",
      answer:
        "Paste a JSON object or array into the input and the tool infers a complete GraphQL schema definition. Object keys become field names, and value types are mapped: strings to String, numbers to Int or Float (based on decimal presence), booleans to Boolean, null values to nullable fields, arrays to list types, and nested objects to separate named types. The generator creates a root Query type with a field returning your data type. Array items are analyzed to determine the consistent element type. If an array contains objects, a new named type is created for the element. The output is valid GraphQL SDL ready to use with any GraphQL server implementation.",
    },
    {
      question: "What is the difference between GraphQL String and ID scalar types?",
      answer:
        "Both String and ID are built-in GraphQL scalar types that serialize as strings. The difference is semantic intent. String represents arbitrary text content like names, descriptions, and messages. ID represents a unique identifier used to fetch or reference an object, similar to a primary key. ID values should not be assumed to be human-readable. GraphQL clients like Apollo and Relay use the ID type for cache normalization, creating a unique cache key by combining the type name and ID value. The converter infers ID type for fields named id, _id, or ending in Id. All other string values default to the String type. You can manually adjust any field type in the generated schema.",
    },
    {
      question: "How are nullable fields represented in the generated GraphQL schema?",
      answer:
        "In GraphQL, all fields are nullable by default. A non-null field is marked with an exclamation mark like name: String! meaning it is guaranteed to return a string and never null. The generator analyzes your JSON data to determine nullability. If a field has a null value in any object in the dataset, it remains nullable (no exclamation mark). If a field always has a non-null value across all objects, it is marked as non-null with the ! modifier. For arrays, the list itself and its elements can each be nullable or non-null independently, like [String!]! (non-null list of non-null strings). Conservative nullability is safer since marking a field non-null is a contract your resolvers must fulfill.",
    },
  ],
  "git-diff-viewer": [
    {
      question: "How do I read a git diff output?",
      answer:
        "A git diff shows changes between two versions of files. Each file section starts with a header showing the old and new file paths (a/ and b/ prefixes). The @@ hunk headers indicate line numbers where changes occur in the format @@ -old_start,old_count +new_start,new_count @@. Lines prefixed with - (shown in red) were removed, lines prefixed with + (shown in green) were added, and lines with no prefix are unchanged context. A modified line appears as a removal followed by an addition. The viewer adds syntax highlighting, line numbers, and the option to switch between unified diff (interleaved changes) and side-by-side display for easier comparison of longer changes.",
    },
    {
      question: "What is the difference between unified and side-by-side diff views?",
      answer:
        "Unified diff displays old and new versions in a single column with removed lines (prefixed -) and added lines (prefixed +) interleaved among unchanged context lines. It is compact and is the default output of git diff. Side-by-side diff shows the old version in a left panel and the new version in a right panel with matching lines aligned horizontally. Changed lines are highlighted in both panels, making it easier to see exactly what changed on each line. Unified view works better for small changes and terminal output. Side-by-side view is better for reviewing large changes, complex refactors, and when you need to compare the before and after states simultaneously.",
    },
    {
      question: "How do I paste a git diff into the viewer?",
      answer:
        "Copy the output of any git diff command from your terminal and paste it directly into the input area. The viewer accepts standard unified diff format produced by git diff, git diff --staged, git show, git log -p, and git format-patch. It also accepts diff output from GitHub pull request .diff URLs and other tools that produce unified diff format. The parser detects file boundaries, hunk headers, and change markers automatically. You can paste diffs containing multiple files and the viewer separates them into individual file sections with collapsible panels. Syntax highlighting is applied based on the file extension detected from the diff headers.",
    },
  ],
  "sql-to-typescript": [
    {
      question: "How do I convert SQL tables to TypeScript interfaces?",
      answer:
        "Paste your SQL CREATE TABLE statements into the input panel. The converter parses column names, data types, nullability constraints, and default values to generate corresponding TypeScript interfaces. SQL types map to TypeScript types: VARCHAR, TEXT, and CHAR become string; INTEGER, SMALLINT, BIGINT, and SERIAL become number; BOOLEAN becomes boolean; TIMESTAMP, DATE, and TIME become Date or string depending on your preference; NUMERIC and DECIMAL become number or string for precision-critical applications. NOT NULL columns become required properties while nullable columns get the optional modifier or union with null. The output includes one interface per table.",
    },
    {
      question: "What is the difference between Prisma schema and Drizzle ORM definitions?",
      answer:
        "Prisma uses its own schema language (schema.prisma) with a declarative syntax. Models define tables with field names, types (@db.VarChar, Int, Boolean), attributes (@id, @default, @unique), and relations. Prisma generates a type-safe client with methods like findMany, create, and update. Drizzle uses TypeScript directly to define schemas with functions like pgTable, varchar, integer, and boolean. Drizzle schemas are plain TypeScript files that export table objects. Drizzle generates SQL-like query builders and supports raw SQL more naturally. The converter outputs your SQL tables in either format: Prisma's .prisma schema language or Drizzle's TypeScript table definitions using your chosen database dialect.",
    },
    {
      question: "How are SQL relationships converted to TypeScript or ORM schemas?",
      answer:
        "Foreign key constraints in SQL (REFERENCES other_table(id)) are converted differently for each output format. For plain TypeScript interfaces, the foreign key column becomes a number or string property (the ID type), and an optional comment notes the relationship. For Prisma, relationships become explicit relation fields with @relation attributes connecting the foreign key to the referenced model, generating both the scalar ID field and the relation object field. For Drizzle, relationships use the relations() helper function with one() and many() definitions that reference other table objects. Primary keys, unique constraints, and indexes are also preserved in the ORM outputs as corresponding decorators or method calls.",
    },
  ],
  "compression-tester": [
    {
      question: "What is the difference between Brotli and Gzip compression?",
      answer:
        "Brotli (br) and Gzip (gz) are both lossless compression algorithms used to reduce HTTP transfer sizes. Brotli typically achieves 15-25% better compression ratios than Gzip, especially for text content like HTML, CSS, and JavaScript. Brotli uses a predefined dictionary of common web content patterns, giving it an advantage for web assets. However, Brotli compression at high quality levels is significantly slower than Gzip, making it better suited for static pre-compressed assets than dynamic responses. Gzip is faster to compress and has universal browser and server support dating back decades. Most modern deployments use Brotli for static assets and Gzip as a fallback for older clients or dynamic content.",
    },
    {
      question: "How do I test compression ratios for my web assets?",
      answer:
        "Paste or upload your text content (HTML, CSS, JavaScript, JSON, SVG) into the tester. It compresses the input using Brotli, Gzip, and Deflate at multiple quality levels and displays the compressed size, compression ratio, and savings percentage for each algorithm. Compare the results to determine which algorithm and quality level gives the best size reduction for your specific content. The tester also shows compression time so you can evaluate the tradeoff between compression ratio and CPU cost. For production use, most CDNs and hosting platforms handle compression automatically, but testing helps you understand expected transfer sizes and verify that your server configuration is delivering compressed responses.",
    },
    {
      question: "What compression quality level should I use for web content?",
      answer:
        "For Gzip, level 6 (the default) provides a good balance of compression ratio and speed. Levels 7-9 offer marginally better compression with noticeably more CPU time. For Brotli, the optimal level depends on your use case. Level 4-6 works well for dynamic content compressed on-the-fly, offering Gzip-like speed with better ratios. Level 11 (maximum) gives the best compression but is very slow, making it suitable only for static assets pre-compressed at build time. Most CDNs like Cloudflare, Vercel, and Netlify handle compression automatically with sensible defaults. If you control your server, pre-compress static files at maximum quality during build and use moderate levels for dynamic API responses.",
    },
  ],
  "ts6-migration": [
    {
      question: "What are the breaking changes in TypeScript 6.0?",
      answer:
        "TypeScript 6.0 introduces several breaking changes centered around stricter default behavior. The strict flag becomes enabled by default in new projects. The isolatedDeclarations option is enforced for library authors, requiring explicit return types on exported functions. The verbatimModuleSyntax replaces the deprecated importsNotUsedAsValues and preserveValueImports flags. Module resolution defaults change so that node16 or nodenext resolution becomes the recommended default over the classic node resolution strategy. Some previously deprecated compiler options are fully removed. The migration checker analyzes your tsconfig.json against these changes and reports which ones affect your project, providing a readiness grade and specific guidance for each required change.",
    },
    {
      question: "How do I check if my project is ready for TypeScript 6.0?",
      answer:
        "Paste your tsconfig.json into the analyzer. It examines your compiler options against the known TypeScript 6.0 breaking changes and generates a readiness report. The report assigns a letter grade (A through F) based on how many changes affect your configuration. Each flagged item includes a description of the breaking change, your current setting, the required or recommended new setting, and migration steps. Issues are categorized by severity: critical changes that will cause build failures, warnings for deprecated options that still work but should be updated, and informational notes about new recommended practices. Address critical issues first, then work through warnings before upgrading your TypeScript dependency.",
    },
    {
      question: "What is isolatedDeclarations and how does it affect my code?",
      answer:
        "The isolatedDeclarations flag requires that all exported functions, classes, and variables have explicit type annotations so that declaration files (.d.ts) can be generated without type inference. Without it, TypeScript infers return types from function bodies, which requires analyzing the full program. With isolatedDeclarations enabled, each file must be self-contained for declaration emit. This means you must add explicit return type annotations to all exported functions and explicit type annotations to exported variables initialized with complex expressions. The benefit is dramatically faster declaration file generation since tools can process files in parallel without a full type checker. Library authors publishing to npm are the primary audience for this feature.",
    },
  ],
  "eslint-to-biome": [
    {
      question: "How do I migrate from ESLint to Biome?",
      answer:
        "Paste your ESLint configuration (eslintrc.json, eslintrc.js, or flat config format) into the converter. It maps your enabled ESLint rules to their Biome equivalents, covering 100+ rules from ESLint core, typescript-eslint, eslint-plugin-react, eslint-plugin-jsx-a11y, eslint-plugin-import, and eslint-plugin-unicorn. The output is a biome.json configuration file with the matched linter rules, formatter settings extracted from your Prettier or ESLint formatting rules, and organizeImports configuration. Rules without Biome equivalents are listed separately so you can evaluate whether to find alternatives or accept the coverage gap. Install Biome with npm install --save-dev @biomejs/biome and replace your ESLint scripts with biome check commands.",
    },
    {
      question: "What is the difference between ESLint and Biome?",
      answer:
        "ESLint is a JavaScript/TypeScript linter written in JavaScript with a plugin ecosystem of thousands of community rules. It is highly configurable but can be slow on large codebases due to its JavaScript runtime and AST parsing approach. Biome is a toolchain written in Rust that combines linting, formatting, and import sorting in a single fast binary. Biome processes files significantly faster than ESLint plus Prettier combined, often 10-100x for large projects. Biome has a smaller rule set than ESLint's full ecosystem but covers the most commonly used rules. Biome cannot be extended with custom JavaScript plugins like ESLint can. Choose Biome for speed and simplicity, or keep ESLint if you depend on specialized community plugins.",
    },
    {
      question: "Which ESLint plugins are supported in the Biome converter?",
      answer:
        "The converter maps rules from the most popular ESLint plugins. ESLint core rules have the broadest coverage with most common rules mapped to Biome lint categories like suspicious, correctness, style, and complexity. The typescript-eslint plugin rules for TypeScript-specific checks are mapped to Biome's TypeScript-aware rules. React plugin rules (eslint-plugin-react) map to Biome's React-specific linting. JSX accessibility rules (eslint-plugin-jsx-a11y) map to Biome's accessibility category. Import rules (eslint-plugin-import) partially map to Biome's organize imports feature. Unicorn rules (eslint-plugin-unicorn) have select mappings. The converter reports unmapped rules so you can assess coverage before completing the migration.",
    },
  ],
};
