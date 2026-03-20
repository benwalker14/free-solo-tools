/**
 * Animated demo data for top tool pages.
 * Each tool has 2-3 before/after examples that auto-cycle on the page.
 * Serves as multimedia content for AI Overview citation optimization.
 */
export interface ToolDemoStep {
  label: string;
  input: string;
  output: string;
  action: string;
}

export const toolDemos: Record<string, ToolDemoStep[]> = {
  "json-formatter": [
    {
      label: "Pretty-print compact JSON",
      action: "Format",
      input: '{"name":"Alice","age":28,"roles":["admin","editor"],"active":true}',
      output: `{
  "name": "Alice",
  "age": 28,
  "roles": [
    "admin",
    "editor"
  ],
  "active": true
}`,
    },
    {
      label: "Minify for production",
      action: "Minify",
      input: `{
  "host": "localhost",
  "port": 3000,
  "debug": false
}`,
      output: '{"host":"localhost","port":3000,"debug":false}',
    },
    {
      label: "Validate & format nested data",
      action: "Format",
      input: '{"users":[{"id":1,"name":"Bob"},{"id":2,"name":"Eve"}],"total":2}',
      output: `{
  "users": [
    { "id": 1, "name": "Bob" },
    { "id": 2, "name": "Eve" }
  ],
  "total": 2
}`,
    },
  ],
  base64: [
    {
      label: "Encode text to Base64",
      action: "Encode",
      input: "Hello, World!",
      output: "SGVsbG8sIFdvcmxkIQ==",
    },
    {
      label: "Decode Base64 to text",
      action: "Decode",
      input: "eyJhcGkiOiJrZXkxMjMifQ==",
      output: '{"api":"key123"}',
    },
    {
      label: "Encode Unicode & emoji",
      action: "Encode",
      input: "DevBolt \u26a1 Tools",
      output: "RGV2Qm9sdCDimqEgVG9vbHM=",
    },
  ],
  "hash-generator": [
    {
      label: "Generate SHA-256 hash",
      action: "Hash",
      input: "hello world",
      output: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    },
    {
      label: "Hash a password string",
      action: "Hash",
      input: "my-secret-password",
      output: "a0f5c6d3b2e1f4a8c7b9d0e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
    },
    {
      label: "Hash API key for logging",
      action: "Hash",
      input: "sk_live_abc123xyz",
      output: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
  ],
  "uuid-generator": [
    {
      label: "Generate a single UUID v4",
      action: "Generate",
      input: "1 UUID",
      output: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    },
    {
      label: "Bulk generate 5 UUIDs",
      action: "Generate",
      input: "5 UUIDs",
      output: `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b
01920a3d-ae77-7e19-b0c1-8a92e0a3f451
a3bb189e-8bf9-3888-9912-ace4e6543002
c56a4180-65aa-42ec-a945-5fd21dec0538`,
    },
    {
      label: "Uppercase format",
      action: "Generate",
      input: "Uppercase",
      output: "550E8400-E29B-41D4-A716-446655440000",
    },
  ],
  "jwt-decoder": [
    {
      label: "Decode a JWT token",
      action: "Decode",
      input: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      output: `Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }`,
    },
    {
      label: "Inspect token claims",
      action: "Decode",
      input: "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLmRldmJvbHQuZGV2Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzE2MjM5MDIyfQ.signature",
      output: `Header: { "alg": "RS256" }
Payload: { "iss": "auth.devbolt.dev", "role": "admin", "exp": 1716239022 }`,
    },
    {
      label: "Check token expiration",
      action: "Decode",
      input: "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYWxpY2UiLCJleHAiOjE3MDAwMDAwMDB9.sig",
      output: `Header: { "alg": "HS256" }
Payload: { "user": "alice", "exp": 1700000000 }
⚠ Token expired: Nov 14, 2023`,
    },
  ],
  "color-converter": [
    {
      label: "HEX to RGB",
      action: "Convert",
      input: "#3B82F6",
      output: "rgb(59, 130, 246)",
    },
    {
      label: "RGB to HSL",
      action: "Convert",
      input: "rgb(34, 197, 94)",
      output: "hsl(142, 71%, 45%)",
    },
    {
      label: "HSL to HEX",
      action: "Convert",
      input: "hsl(262, 83%, 58%)",
      output: "#8B5CF6",
    },
  ],
  "regex-tester": [
    {
      label: "Match email addresses",
      action: "Test",
      input: `Pattern: [\\w.-]+@[\\w.-]+\\.\\w+
Text: Contact us at hello@devbolt.dev or support@example.com`,
      output: `Match 1: hello@devbolt.dev
Match 2: support@example.com`,
    },
    {
      label: "Extract dates from text",
      action: "Test",
      input: `Pattern: \\d{4}-\\d{2}-\\d{2}
Text: Released on 2026-03-19, updated 2026-04-01`,
      output: `Match 1: 2026-03-19
Match 2: 2026-04-01`,
    },
    {
      label: "Validate IP addresses",
      action: "Test",
      input: `Pattern: ^\\d{1,3}(\\.\\d{1,3}){3}$
Text: 192.168.1.1`,
      output: `Match: 192.168.1.1 (full match)`,
    },
  ],
  "url-parser": [
    {
      label: "Parse a full URL",
      action: "Parse",
      input: "https://api.example.com:8080/v2/users?page=3&sort=name#results",
      output: `Protocol: https
Host: api.example.com
Port: 8080
Path: /v2/users
Query: page=3, sort=name
Fragment: results`,
    },
    {
      label: "Extract query parameters",
      action: "Parse",
      input: "https://shop.com/search?q=laptop&category=electronics&min_price=500",
      output: `q: laptop
category: electronics
min_price: 500`,
    },
    {
      label: "Identify URL components",
      action: "Parse",
      input: "ftp://user:pass@files.internal.net/uploads/report.pdf",
      output: `Protocol: ftp
Username: user
Password: pass
Host: files.internal.net
Path: /uploads/report.pdf`,
    },
  ],
  "epoch-converter": [
    {
      label: "Unix timestamp to date",
      action: "Convert",
      input: "1710864000",
      output: "March 19, 2024 20:00:00 UTC",
    },
    {
      label: "Date to Unix timestamp",
      action: "Convert",
      input: "2026-01-01 00:00:00 UTC",
      output: "1767225600",
    },
    {
      label: "Milliseconds to date",
      action: "Convert",
      input: "1710864000000",
      output: "March 19, 2024 20:00:00.000 UTC",
    },
  ],
  "password-generator": [
    {
      label: "Strong 20-character password",
      action: "Generate",
      input: "Length: 20, All character types",
      output: "K#9mV&pL2$xQ8nR!wZ5j",
    },
    {
      label: "Passphrase (4 words)",
      action: "Generate",
      input: "4 random words",
      output: "correct-horse-battery-staple",
    },
    {
      label: "PIN code",
      action: "Generate",
      input: "Length: 6, Numbers only",
      output: "847293",
    },
  ],
  "diff-checker": [
    {
      label: "Compare two code snippets",
      action: "Diff",
      input: `Old: const x = 5;
New: const x = 10;`,
      output: `- const x = 5;
+ const x = 10;
  1 line changed`,
    },
    {
      label: "Find config changes",
      action: "Diff",
      input: `Old: port: 3000
New: port: 8080`,
      output: `- port: 3000
+ port: 8080
  1 modification`,
    },
    {
      label: "Detect added lines",
      action: "Diff",
      input: `Old: line 1
New: line 1, line 2`,
      output: `  line 1
+ line 2
  1 addition`,
    },
  ],
  "case-converter": [
    {
      label: "Convert to camelCase",
      action: "Convert",
      input: "user_first_name",
      output: "userFirstName",
    },
    {
      label: "Convert to snake_case",
      action: "Convert",
      input: "getUserProfile",
      output: "get_user_profile",
    },
    {
      label: "Convert to kebab-case",
      action: "Convert",
      input: "MyComponentName",
      output: "my-component-name",
    },
  ],
  "csv-json": [
    {
      label: "CSV to JSON",
      action: "Convert",
      input: `name,age,city
Alice,28,NYC
Bob,35,London`,
      output: `[
  { "name": "Alice", "age": "28", "city": "NYC" },
  { "name": "Bob", "age": "35", "city": "London" }
]`,
    },
    {
      label: "JSON to CSV",
      action: "Convert",
      input: `[{"id":1,"status":"active"},{"id":2,"status":"pending"}]`,
      output: `id,status
1,active
2,pending`,
    },
    {
      label: "Handle quoted fields",
      action: "Convert",
      input: `name,address
"Smith, John","123 Main St, Apt 4"`,
      output: `[
  { "name": "Smith, John", "address": "123 Main St, Apt 4" }
]`,
    },
  ],
  "url-encoder": [
    {
      label: "Encode special characters",
      action: "Encode",
      input: "hello world & goodbye!",
      output: "hello%20world%20%26%20goodbye%21",
    },
    {
      label: "Decode URL-encoded string",
      action: "Decode",
      input: "search%3Fq%3Djavascript%26page%3D1",
      output: "search?q=javascript&page=1",
    },
    {
      label: "Encode Unicode characters",
      action: "Encode",
      input: "caf\u00e9 & r\u00e9sum\u00e9",
      output: "caf%C3%A9%20%26%20r%C3%A9sum%C3%A9",
    },
  ],
  "markdown-preview": [
    {
      label: "Format headers and lists",
      action: "Render",
      input: `# My Title
- Item one
- Item **two**
- Item *three*`,
      output: `<h1>My Title</h1>
<ul>
  <li>Item one</li>
  <li>Item <strong>two</strong></li>
  <li>Item <em>three</em></li>
</ul>`,
    },
    {
      label: "Render a table",
      action: "Render",
      input: `| Name | Role |
|------|------|
| Alice | Admin |
| Bob | Editor |`,
      output: `<table>
  <tr><th>Name</th><th>Role</th></tr>
  <tr><td>Alice</td><td>Admin</td></tr>
  <tr><td>Bob</td><td>Editor</td></tr>
</table>`,
    },
    {
      label: "Code block with syntax",
      action: "Render",
      input: "```js\nconsole.log('hello');\n```",
      output: `<pre><code class="language-js">
console.log('hello');
</code></pre>`,
    },
  ],
};
