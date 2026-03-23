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
  "json-yaml": [
    {
      label: "Convert JSON config to YAML",
      action: "Convert",
      input: `{"server":{"host":"localhost","port":3000},"debug":true}`,
      output: `server:
  host: localhost
  port: 3000
debug: true`,
    },
    {
      label: "Convert YAML to JSON",
      action: "Convert",
      input: `name: my-app
version: 1.0.0
dependencies:
  - express
  - cors`,
      output: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": ["express", "cors"]
}`,
    },
    {
      label: "Nested YAML to JSON",
      action: "Convert",
      input: `database:
  host: db.example.com
  port: 5432
  credentials:
    user: admin
    password: secret`,
      output: `{
  "database": {
    "host": "db.example.com",
    "port": 5432,
    "credentials": {
      "user": "admin",
      "password": "secret"
    }
  }
}`,
    },
  ],
  "html-entities": [
    {
      label: "Encode special HTML characters",
      action: "Encode",
      input: `<div class="alert">Price: $5 & up</div>`,
      output: `&lt;div class=&quot;alert&quot;&gt;Price: $5 &amp; up&lt;/div&gt;`,
    },
    {
      label: "Decode HTML entities to text",
      action: "Decode",
      input: `&lt;script&gt;alert(&apos;hello&apos;)&lt;/script&gt;`,
      output: `<script>alert('hello')</script>`,
    },
    {
      label: "Encode for safe embedding",
      action: "Encode",
      input: `Tom & Jerry's "Adventure" © 2024`,
      output: `Tom &amp; Jerry&apos;s &quot;Adventure&quot; &copy; 2024`,
    },
  ],
  "chmod-calculator": [
    {
      label: "Standard file permissions",
      action: "Calculate",
      input: `Owner: read, write
Group: read
Others: read`,
      output: `chmod 644 file.txt
-rw-r--r--`,
    },
    {
      label: "Executable script permissions",
      action: "Calculate",
      input: `Owner: read, write, execute
Group: read, execute
Others: read, execute`,
      output: `chmod 755 script.sh
-rwxr-xr-x`,
    },
    {
      label: "Private key permissions",
      action: "Calculate",
      input: `Owner: read, write
Group: none
Others: none`,
      output: `chmod 600 id_rsa
-rw-------`,
    },
  ],
  "qr-code": [
    {
      label: "Generate URL QR code",
      action: "Generate",
      input: `https://devbolt.dev`,
      output: `[QR Code Image]
Size: 256×256px
Error correction: M`,
    },
    {
      label: "WiFi connection QR code",
      action: "Generate",
      input: `WIFI:T:WPA;S:MyNetwork;P:pass123;;`,
      output: `[QR Code Image]
Network: MyNetwork
Security: WPA`,
    },
    {
      label: "Contact vCard QR code",
      action: "Generate",
      input: `BEGIN:VCARD
FN:Jane Smith
TEL:+1234567890
END:VCARD`,
      output: `[QR Code Image]
Type: vCard
Contact: Jane Smith`,
    },
  ],
  "sql-formatter": [
    {
      label: "Format a compact SELECT query",
      action: "Format",
      input: `SELECT u.name, u.email, COUNT(o.id) as orders FROM users u JOIN orders o ON u.id = o.user_id WHERE u.active = true GROUP BY u.name, u.email HAVING COUNT(o.id) > 5 ORDER BY orders DESC;`,
      output: `SELECT
  u.name,
  u.email,
  COUNT(o.id) AS orders
FROM users u
JOIN orders o
  ON u.id = o.user_id
WHERE u.active = true
GROUP BY
  u.name,
  u.email
HAVING COUNT(o.id) > 5
ORDER BY orders DESC;`,
    },
    {
      label: "Format a CREATE TABLE statement",
      action: "Format",
      input: `CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10,2) DEFAULT 0.00, created_at TIMESTAMP DEFAULT NOW());`,
      output: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW()
);`,
    },
    {
      label: "Format nested subquery",
      action: "Format",
      input: `SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 100) AND status = 'active';`,
      output: `SELECT *
FROM users
WHERE id IN (
  SELECT user_id
  FROM orders
  WHERE total > 100
)
AND status = 'active';`,
    },
  ],
  "word-counter": [
    {
      label: "Count a paragraph",
      action: "Analyze",
      input: `The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the English alphabet.`,
      output: `Words: 19
Characters: 111
Sentences: 2
Reading time: <1 min`,
    },
    {
      label: "Analyze tweet length",
      action: "Analyze",
      input: `Just shipped a new feature! 🚀 Check out our latest update at devbolt.dev #webdev #coding`,
      output: `Words: 14
Characters: 89 / 280
Sentences: 2
Reading time: <1 min`,
    },
    {
      label: "Code comment analysis",
      action: "Analyze",
      input: `This function validates user input by checking email format, password strength, and username availability against the database.`,
      output: `Words: 17
Characters: 122
Sentences: 1
Reading time: <1 min`,
    },
  ],
  "number-base-converter": [
    {
      label: "Decimal to hexadecimal",
      action: "Convert",
      input: `255`,
      output: `Hex: FF
Binary: 11111111
Octal: 377`,
    },
    {
      label: "Hex color to decimal RGB",
      action: "Convert",
      input: `#3B82F6 (Hex)`,
      output: `R: 59  G: 130  B: 246
Binary: 00111011 10000010 11110110`,
    },
    {
      label: "Binary to decimal",
      action: "Convert",
      input: `10101010 (Binary)`,
      output: `Decimal: 170
Hex: AA
Octal: 252`,
    },
  ],
  "lorem-ipsum": [
    {
      label: "Generate 2 paragraphs",
      action: "Generate",
      input: `Paragraphs: 2
Type: Standard`,
      output: `Lorem ipsum dolor sit amet, consectetur
adipiscing elit. Sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut
aliquip ex ea commodo consequat.`,
    },
    {
      label: "Generate word list",
      action: "Generate",
      input: `Words: 10
Type: Words only`,
      output: `lorem ipsum dolor sit amet consectetur
adipiscing elit sed do`,
    },
    {
      label: "Generate sentences",
      action: "Generate",
      input: `Sentences: 3
Type: Sentences`,
      output: `Lorem ipsum dolor sit amet. Consectetur
adipiscing elit sed do eiusmod. Tempor
incididunt ut labore et dolore.`,
    },
  ],
  "json-to-typescript": [
    {
      label: "Convert API response to interfaces",
      action: "Generate",
      input: `{"id":1,"name":"Alice","email":"a@b.com","active":true}`,
      output: `interface Root {
  id: number;
  name: string;
  email: string;
  active: boolean;
}`,
    },
    {
      label: "Nested object types",
      action: "Generate",
      input: `{"user":{"name":"Bob","address":{"city":"NYC","zip":"10001"}}}`,
      output: `interface Address {
  city: string;
  zip: string;
}

interface User {
  name: string;
  address: Address;
}

interface Root {
  user: User;
}`,
    },
    {
      label: "Array of objects",
      action: "Generate",
      input: `{"items":[{"id":1,"title":"Post"},{"id":2,"title":"Comment"}]}`,
      output: `interface Item {
  id: number;
  title: string;
}

interface Root {
  items: Item[];
}`,
    },
  ],
  "xml-formatter": [
    {
      label: "Format compact XML",
      action: "Format",
      input: `<root><user id="1"><name>Alice</name><email>a@b.com</email></user></root>`,
      output: `<root>
  <user id="1">
    <name>Alice</name>
    <email>a@b.com</email>
  </user>
</root>`,
    },
    {
      label: "Format SOAP envelope",
      action: "Format",
      input: `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><GetUser><ID>42</ID></GetUser></soap:Body></soap:Envelope>`,
      output: `<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetUser>
      <ID>42</ID>
    </GetUser>
  </soap:Body>
</soap:Envelope>`,
    },
    {
      label: "Validate and format config",
      action: "Format",
      input: `<?xml version="1.0"?><config><db host="localhost" port="5432"/><cache ttl="300"/></config>`,
      output: `<?xml version="1.0"?>
<config>
  <db host="localhost" port="5432"/>
  <cache ttl="300"/>
</config>`,
    },
  ],
  "image-base64": [
    {
      label: "Small icon to data URI",
      action: "Convert",
      input: `[16×16 PNG favicon]
Size: 1.2 KB`,
      output: `data:image/png;base64,
iVBORw0KGgoAAAANSUhEU...
Length: 1,608 characters (+34%)`,
    },
    {
      label: "Photo to Base64",
      action: "Convert",
      input: `[800×600 JPEG photo]
Size: 45 KB`,
      output: `data:image/jpeg;base64,
/9j/4AAQSkZJRgABAQ...
Length: 61,440 characters (+36%)`,
    },
    {
      label: "SVG to inline data URI",
      action: "Convert",
      input: `<svg width="24" height="24">
  <circle cx="12" cy="12" r="10"/>
</svg>`,
      output: `data:image/svg+xml;base64,
PHN2ZyB3aWR0aD0iMjQi...
Length: 96 characters`,
    },
  ],
  "code-minifier": [
    {
      label: "Minify JavaScript",
      action: "Minify",
      input: `function greet(name) {
  const message = "Hello, " + name;
  console.log(message);
  return message;
}`,
      output: `function greet(n){const m="Hello, "+n;console.log(m);return m}`,
    },
    {
      label: "Minify CSS",
      action: "Minify",
      input: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}`,
      output: `.container{display:flex;justify-content:center;align-items:center;padding:16px}`,
    },
    {
      label: "Beautify minified HTML",
      action: "Beautify",
      input: `<div class="card"><h2>Title</h2><p>Content here</p><a href="#">Link</a></div>`,
      output: `<div class="card">
  <h2>Title</h2>
  <p>Content here</p>
  <a href="#">Link</a>
</div>`,
    },
  ],
  "gradient-generator": [
    {
      label: "Two-color linear gradient",
      action: "Generate",
      input: `Direction: to right
Color 1: #3B82F6
Color 2: #8B5CF6`,
      output: `background: linear-gradient(
  to right,
  #3B82F6,
  #8B5CF6
);`,
    },
    {
      label: "Radial gradient",
      action: "Generate",
      input: `Shape: circle
Center: center
Color 1: #F59E0B
Color 2: #EF4444`,
      output: `background: radial-gradient(
  circle at center,
  #F59E0B,
  #EF4444
);`,
    },
    {
      label: "Three-color gradient",
      action: "Generate",
      input: `Direction: 135deg
#667EEA → #764BA2 → #F093FB`,
      output: `background: linear-gradient(
  135deg,
  #667EEA 0%,
  #764BA2 50%,
  #F093FB 100%
);`,
    },
  ],
  "slug-generator": [
    {
      label: "Blog post title to slug",
      action: "Generate",
      input: `How to Fix "Invalid JSON" Errors in 2024`,
      output: `how-to-fix-invalid-json-errors-in-2024`,
    },
    {
      label: "Unicode title to slug",
      action: "Generate",
      input: `Café Résumé — Tips & Tricks (Updated!)`,
      output: `cafe-resume-tips-and-tricks-updated`,
    },
    {
      label: "Product name to slug",
      action: "Generate",
      input: `DevBolt Pro: 100+ Developer Tools`,
      output: `devbolt-pro-100-developer-tools`,
    },
  ],
  "cron-parser": [
    {
      label: "Parse a common cron schedule",
      action: "Parse",
      input: `*/15 * * * *`,
      output: `Every 15 minutes`,
    },
    {
      label: "Weekday morning schedule",
      action: "Parse",
      input: `0 9 * * 1-5`,
      output: `At 09:00 AM, Monday through Friday`,
    },
    {
      label: "Monthly backup schedule",
      action: "Parse",
      input: `0 2 1 * *`,
      output: `At 02:00 AM on the 1st of every month`,
    },
  ],
  "json-path": [
    {
      label: "Extract nested field",
      action: "Query",
      input: `Path: $.store.book[0].title
Data: {"store":{"book":[{"title":"Moby Dick"}]}}`,
      output: `"Moby Dick"`,
    },
    {
      label: "Filter by price",
      action: "Query",
      input: `Path: $.store.book[?(@.price<10)]
Data: {"store":{"book":[{"title":"A","price":8},{"title":"B","price":12}]}}`,
      output: `[{"title": "A", "price": 8}]`,
    },
    {
      label: "Select all authors",
      action: "Query",
      input: `Path: $..author
Data: {"books":[{"author":"Tolkien"},{"author":"Orwell"}]}`,
      output: `["Tolkien", "Orwell"]`,
    },
  ],
  "json-diff": [
    {
      label: "Detect value change",
      action: "Compare",
      input: `Left:  {"name":"Alice","age":28}
Right: {"name":"Alice","age":29}`,
      output: `~ age: 28 → 29
1 change found`,
    },
    {
      label: "Detect added field",
      action: "Compare",
      input: `Left:  {"id":1}
Right: {"id":1,"role":"admin"}`,
      output: `+ role: "admin"
1 addition found`,
    },
    {
      label: "Detect removed field",
      action: "Compare",
      input: `Left:  {"host":"localhost","port":3000,"debug":true}
Right: {"host":"localhost","port":3000}`,
      output: `- debug: true
1 removal found`,
    },
  ],
  "curl-converter": [
    {
      label: "cURL to JavaScript fetch",
      action: "Convert",
      input: `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"Alice"}'`,
      output: `const res = await fetch(
  "https://api.example.com/users",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Alice" }),
  }
);`,
    },
    {
      label: "cURL to Python requests",
      action: "Convert",
      input: `curl https://api.example.com/users?page=1 -H "Authorization: Bearer token123"`,
      output: `import requests

response = requests.get(
    "https://api.example.com/users",
    params={"page": "1"},
    headers={"Authorization": "Bearer token123"},
)`,
    },
    {
      label: "cURL to Go net/http",
      action: "Convert",
      input: `curl -X DELETE https://api.example.com/users/42`,
      output: `req, _ := http.NewRequest(
  "DELETE",
  "https://api.example.com/users/42",
  nil,
)
client := &http.Client{}
resp, _ := client.Do(req)`,
    },
  ],
  "html-to-jsx": [
    {
      label: "Convert class to className",
      action: "Convert",
      input: `<div class="container">
  <label for="email">Email</label>
  <input type="email" tabindex="1" />
</div>`,
      output: `<div className="container">
  <label htmlFor="email">Email</label>
  <input type="email" tabIndex="1" />
</div>`,
    },
    {
      label: "Convert inline style",
      action: "Convert",
      input: `<p style="font-size: 16px; color: red;">Hello</p>`,
      output: `<p style={{ fontSize: "16px", color: "red" }}>Hello</p>`,
    },
    {
      label: "Self-close void elements",
      action: "Convert",
      input: `<img src="logo.png" alt="Logo">
<br>
<hr>`,
      output: `<img src="logo.png" alt="Logo" />
<br />
<hr />`,
    },
  ],
  "json-to-csv": [
    {
      label: "Flat JSON array to CSV",
      action: "Convert",
      input: `[
  {"name":"Alice","age":28,"city":"NYC"},
  {"name":"Bob","age":35,"city":"London"}
]`,
      output: `name,age,city
Alice,28,NYC
Bob,35,London`,
    },
    {
      label: "Nested fields with dot notation",
      action: "Convert",
      input: `[{"user":{"name":"Alice"},"role":"admin"}]`,
      output: `user.name,role
Alice,admin`,
    },
    {
      label: "Handle special characters",
      action: "Convert",
      input: `[{"company":"Smith, Jones & Co","revenue":"$1,000,000"}]`,
      output: `company,revenue
"Smith, Jones & Co","$1,000,000"`,
    },
  ],
  "json-to-code": [
    {
      label: "JSON to Go struct",
      action: "Generate",
      input: `{"id":1,"name":"Alice","email":"a@b.com","active":true}`,
      output: `type Root struct {
    ID     int    \`json:"id"\`
    Name   string \`json:"name"\`
    Email  string \`json:"email"\`
    Active bool   \`json:"active"\`
}`,
    },
    {
      label: "JSON to Python dataclass",
      action: "Generate",
      input: `{"title":"Post","views":100,"tags":["go","rust"]}`,
      output: `@dataclass
class Root:
    title: str
    views: int
    tags: list[str]`,
    },
    {
      label: "JSON to Rust struct",
      action: "Generate",
      input: `{"name":"Alice","score":95.5,"passed":true}`,
      output: `#[derive(Serialize, Deserialize)]
struct Root {
    name: String,
    score: f64,
    passed: bool,
}`,
    },
  ],
  "json-to-sql": [
    {
      label: "JSON to CREATE TABLE + INSERT",
      action: "Convert",
      input: `[{"id":1,"name":"Alice","email":"a@b.com"}]`,
      output: `CREATE TABLE data (
  id INTEGER,
  name VARCHAR(255),
  email VARCHAR(255)
);

INSERT INTO data (id, name, email)
VALUES (1, 'Alice', 'a@b.com');`,
    },
    {
      label: "Auto-detect column types",
      action: "Convert",
      input: `[{"price":29.99,"active":true,"created":"2026-01-15"}]`,
      output: `CREATE TABLE data (
  price DECIMAL(10,2),
  active BOOLEAN,
  created TIMESTAMP
);`,
    },
    {
      label: "PostgreSQL dialect",
      action: "Convert",
      input: `[{"id":"550e8400-e29b-41d4","data":{"key":"val"}}]`,
      output: `CREATE TABLE data (
  id UUID,
  data JSONB
);`,
    },
  ],
  "json-to-zod": [
    {
      label: "Simple object to Zod schema",
      action: "Generate",
      input: `{"name":"Alice","age":28,"email":"a@b.com"}`,
      output: `const schema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
});`,
    },
    {
      label: "Nested object with array",
      action: "Generate",
      input: `{"user":{"name":"Bob","roles":["admin","editor"]}}`,
      output: `const schema = z.object({
  user: z.object({
    name: z.string(),
    roles: z.array(z.string()),
  }),
});`,
    },
    {
      label: "Nullable and optional fields",
      action: "Generate",
      input: `{"id":1,"bio":null,"tags":[]}`,
      output: `const schema = z.object({
  id: z.number(),
  bio: z.string().nullable(),
  tags: z.array(z.unknown()),
});`,
    },
  ],
  "json-to-graphql": [
    {
      label: "JSON to GraphQL type",
      action: "Generate",
      input: `{"id":1,"name":"Alice","email":"a@b.com"}`,
      output: `type Root {
  id: Int!
  name: String!
  email: String!
}`,
    },
    {
      label: "Nested object types",
      action: "Generate",
      input: `{"user":{"name":"Bob","posts":[{"title":"Hello"}]}}`,
      output: `type Post {
  title: String!
}

type User {
  name: String!
  posts: [Post!]!
}

type Root {
  user: User!
}`,
    },
    {
      label: "Generate Query type",
      action: "Generate",
      input: `{"id":"uuid-123","status":"active","price":29.99}`,
      output: `type Root {
  id: ID!
  status: String!
  price: Float!
}

type Query {
  getRoot(id: ID!): Root
  listRoots: [Root!]!
}`,
    },
  ],
  "json-xml": [
    {
      label: "JSON to XML",
      action: "Convert",
      input: `{"user":{"name":"Alice","age":28}}`,
      output: `<?xml version="1.0"?>
<user>
  <name>Alice</name>
  <age>28</age>
</user>`,
    },
    {
      label: "XML to JSON",
      action: "Convert",
      input: `<book id="1">
  <title>Dune</title>
  <author>Herbert</author>
</book>`,
      output: `{
  "book": {
    "@id": "1",
    "title": "Dune",
    "author": "Herbert"
  }
}`,
    },
    {
      label: "Array conversion",
      action: "Convert",
      input: `{"items":{"item":[{"name":"A"},{"name":"B"}]}}`,
      output: `<items>
  <item><name>A</name></item>
  <item><name>B</name></item>
</items>`,
    },
  ],
  "css-to-tailwind": [
    {
      label: "Layout CSS to Tailwind",
      action: "Convert",
      input: `.card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  gap: 8px;
}`,
      output: `flex justify-center items-center p-4 gap-2`,
    },
    {
      label: "Typography styles",
      action: "Convert",
      input: `.heading {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: #1f2937;
}`,
      output: `text-2xl font-bold leading-normal text-gray-800`,
    },
    {
      label: "Responsive width and border",
      action: "Convert",
      input: `.box {
  width: 100%;
  max-width: 640px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}`,
      output: `w-full max-w-xl rounded-lg border border-gray-200`,
    },
  ],
  "tailwind-to-css": [
    {
      label: "Layout utilities to CSS",
      action: "Convert",
      input: `flex items-center justify-between p-4 gap-2`,
      output: `display: flex;
align-items: center;
justify-content: space-between;
padding: 1rem;
gap: 0.5rem;`,
    },
    {
      label: "Typography utilities",
      action: "Convert",
      input: `text-xl font-semibold text-gray-900 leading-tight`,
      output: `font-size: 1.25rem;
line-height: 1.75rem;
font-weight: 600;
color: #111827;
line-height: 1.25;`,
    },
    {
      label: "Spacing and sizing",
      action: "Convert",
      input: `w-full max-w-md mx-auto rounded-lg shadow-md`,
      output: `width: 100%;
max-width: 28rem;
margin-left: auto;
margin-right: auto;
border-radius: 0.5rem;
box-shadow: 0 4px 6px -1px rgba(0,0,0,.1);`,
    },
  ],
  "typescript-to-js": [
    {
      label: "Strip interface and types",
      action: "Convert",
      input: `interface User {
  name: string;
  age: number;
}

const greet = (user: User): string => {
  return \`Hello, \${user.name}\`;
};`,
      output: `const greet = (user) => {
  return \`Hello, \${user.name}\`;
};`,
    },
    {
      label: "Convert enum to object",
      action: "Convert",
      input: `enum Status {
  Active = "active",
  Inactive = "inactive",
}`,
      output: `const Status = {
  Active: "active",
  Inactive: "inactive",
};`,
    },
    {
      label: "Remove generics and assertions",
      action: "Convert",
      input: `const data = response.json() as ApiResponse<User[]>;
const items: Array<string> = [];`,
      output: `const data = response.json();
const items = [];`,
    },
  ],
  "svg-to-jsx": [
    {
      label: "Convert SVG attributes to JSX",
      action: "Convert",
      input: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path stroke-width="2" fill-opacity="0.5" clip-path="url(#c)" d="M12 2L2 22h20z"/>
</svg>`,
      output: `<svg viewBox="0 0 24 24">
  <path strokeWidth="2" fillOpacity="0.5" clipPath="url(#c)" d="M12 2L2 22h20z"/>
</svg>`,
    },
    {
      label: "Generate React component",
      action: "Convert",
      input: `<svg width="24" height="24" class="icon">
  <circle cx="12" cy="12" r="10"/>
</svg>`,
      output: `const Icon = (props) => (
  <svg width="24" height="24"
    className="icon" {...props}>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);`,
    },
    {
      label: "Convert inline styles",
      action: "Convert",
      input: `<svg>
  <rect style="fill: red; stroke-width: 2"/>
</svg>`,
      output: `<svg>
  <rect style={{ fill: "red", strokeWidth: 2 }}/>
</svg>`,
    },
  ],
  "html-markdown": [
    {
      label: "HTML to Markdown",
      action: "Convert",
      input: `<h1>Title</h1>
<p>This is <strong>bold</strong> and <em>italic</em>.</p>
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>`,
      output: `# Title

This is **bold** and *italic*.

- Item one
- Item two`,
    },
    {
      label: "Markdown to HTML",
      action: "Convert",
      input: `## Features

1. Fast **performance**
2. Easy [setup](https://example.com)
3. \`Zero config\``,
      output: `<h2>Features</h2>
<ol>
  <li>Fast <strong>performance</strong></li>
  <li>Easy <a href="https://example.com">setup</a></li>
  <li><code>Zero config</code></li>
</ol>`,
    },
    {
      label: "Convert HTML table",
      action: "Convert",
      input: `<table>
  <tr><th>Name</th><th>Role</th></tr>
  <tr><td>Alice</td><td>Admin</td></tr>
</table>`,
      output: `| Name | Role |
|------|------|
| Alice | Admin |`,
    },
  ],
  "toml-converter": [
    {
      label: "TOML to JSON",
      action: "Convert",
      input: `[package]
name = "my-app"
version = "1.0.0"
edition = "2021"

[dependencies]
serde = "1.0"
tokio = { version = "1", features = ["full"] }`,
      output: `{
  "package": {
    "name": "my-app",
    "version": "1.0.0",
    "edition": "2021"
  },
  "dependencies": {
    "serde": "1.0",
    "tokio": { "version": "1", "features": ["full"] }
  }
}`,
    },
    {
      label: "JSON to TOML",
      action: "Convert",
      input: `{"server":{"host":"0.0.0.0","port":8080},"debug":false}`,
      output: `debug = false

[server]
host = "0.0.0.0"
port = 8080`,
    },
    {
      label: "TOML to YAML",
      action: "Convert",
      input: `[tool.pytest.ini_options]
minversion = "6.0"
testpaths = ["tests"]`,
      output: `tool:
  pytest:
    ini_options:
      minversion: "6.0"
      testpaths:
        - tests`,
    },
  ],
  "encode-decode": [
    {
      label: "Hex encode text",
      action: "Encode",
      input: `Hello, World!`,
      output: `48656c6c6f2c20576f726c6421`,
    },
    {
      label: "Base32 encode",
      action: "Encode",
      input: `DevBolt`,
      output: `IRSWG33OMUXA====`,
    },
    {
      label: "Binary encode",
      action: "Encode",
      input: `Hi`,
      output: `01001000 01101001`,
    },
  ],
  "text-binary": [
    {
      label: "Text to binary",
      action: "Convert",
      input: `Hello`,
      output: `01001000 01100101 01101100
01101100 01101111`,
    },
    {
      label: "Binary to text",
      action: "Convert",
      input: `01000100 01100101 01110110`,
      output: `Dev`,
    },
    {
      label: "Encode with ASCII codes",
      action: "Convert",
      input: `A B C`,
      output: `01000001 00100000 01000010
00100000 01000011
ASCII: 65 32 66 32 67`,
    },
  ],
  "yaml-formatter": [
    {
      label: "Format messy YAML",
      action: "Format",
      input: `name: my-app
version:   1.0
deps:
  - express
  -    cors
  - dotenv`,
      output: `name: my-app
version: 1.0
deps:
  - express
  - cors
  - dotenv`,
    },
    {
      label: "Validate YAML syntax",
      action: "Validate",
      input: `server:
  host: localhost
  port: 3000
  ssl: true`,
      output: `Valid YAML
Keys: 4
Depth: 2
Type: object`,
    },
    {
      label: "Sort YAML keys",
      action: "Format",
      input: `port: 8080
name: api
host: 0.0.0.0
debug: false`,
      output: `debug: false
host: 0.0.0.0
name: api
port: 8080`,
    },
  ],
  "box-shadow": [
    {
      label: "Subtle card shadow",
      action: "Generate",
      input: `Offset: 0 4px
Blur: 6px
Spread: -1px
Color: rgba(0,0,0,0.1)`,
      output: `box-shadow:
  0 4px 6px -1px rgba(0, 0, 0, 0.1);`,
    },
    {
      label: "Elevated button shadow",
      action: "Generate",
      input: `Offset: 0 10px
Blur: 15px
Spread: -3px
Color: rgba(0,0,0,0.2)`,
      output: `box-shadow:
  0 10px 15px -3px rgba(0, 0, 0, 0.2);`,
    },
    {
      label: "Inset shadow",
      action: "Generate",
      input: `Inset: true
Offset: 0 2px
Blur: 4px
Color: rgba(0,0,0,0.06)`,
      output: `box-shadow:
  inset 0 2px 4px rgba(0, 0, 0, 0.06);`,
    },
  ],
  "border-radius": [
    {
      label: "Rounded corners",
      action: "Generate",
      input: `All corners: 12px`,
      output: `border-radius: 12px;`,
    },
    {
      label: "Pill shape",
      action: "Generate",
      input: `All corners: 9999px`,
      output: `border-radius: 9999px;
/* Creates a pill/capsule shape */`,
    },
    {
      label: "Custom per-corner",
      action: "Generate",
      input: `Top-left: 16px
Top-right: 16px
Bottom-right: 0
Bottom-left: 0`,
      output: `border-radius: 16px 16px 0 0;
/* Rounded top, flat bottom */`,
    },
  ],
  "contrast-checker": [
    {
      label: "Check dark text on white",
      action: "Check",
      input: `Text: #1F2937
Background: #FFFFFF`,
      output: `Contrast ratio: 15.4:1
WCAG AA: Pass (normal + large)
WCAG AAA: Pass (normal + large)`,
    },
    {
      label: "Check brand colors",
      action: "Check",
      input: `Text: #FFFFFF
Background: #3B82F6`,
      output: `Contrast ratio: 4.6:1
WCAG AA: Pass (large only)
WCAG AAA: Fail`,
    },
    {
      label: "Low contrast warning",
      action: "Check",
      input: `Text: #9CA3AF
Background: #F3F4F6`,
      output: `Contrast ratio: 2.1:1
WCAG AA: Fail
WCAG AAA: Fail
Suggestion: Darken text to #6B7280`,
    },
  ],
  "markdown-table": [
    {
      label: "Generate a 3-column table",
      action: "Generate",
      input: `Columns: Name, Role, Team
Rows: 3`,
      output: `| Name  | Role    | Team      |
|-------|---------|-----------|
| Alice | Admin   | Platform  |
| Bob   | Dev     | Frontend  |
| Eve   | DevOps  | Infra     |`,
    },
    {
      label: "Aligned columns",
      action: "Generate",
      input: `Columns: Feature, Status, Priority
Align: left, center, right`,
      output: `| Feature | Status | Priority |
|:--------|:------:|---------:|
| Auth    | Done   |     High |
| Search  | WIP    |   Medium |`,
    },
    {
      label: "Comparison table",
      action: "Generate",
      input: `Columns: Tool, Free, Pro
Rows: 2`,
      output: `| Tool     | Free | Pro |
|----------|------|-----|
| JSON     | Yes  | Yes |
| API Keys | No   | Yes |`,
    },
  ],
  "color-palette": [
    {
      label: "Generate from base color",
      action: "Generate",
      input: `Base: #3B82F6`,
      output: `50:  #EFF6FF
100: #DBEAFE
200: #BFDBFE
300: #93C5FD
400: #60A5FA
500: #3B82F6
600: #2563EB
700: #1D4ED8
800: #1E40AF
900: #1E3A8A`,
    },
    {
      label: "Complementary pair",
      action: "Generate",
      input: `Color: #8B5CF6 (violet)`,
      output: `Primary:  #8B5CF6
Complement: #F6E05E
Analogous: #6366F1, #A855F7`,
    },
    {
      label: "Triadic harmony",
      action: "Generate",
      input: `Color: #EF4444 (red)`,
      output: `Color 1: #EF4444 (red)
Color 2: #22C55E (green)
Color 3: #3B82F6 (blue)`,
    },
  ],
  "git-diff-viewer": [
    {
      label: "View file modification",
      action: "Render",
      input: `--- a/config.ts
+++ b/config.ts
@@ -1,3 +1,3 @@
 const config = {
-  port: 3000,
+  port: 8080,
 };`,
      output: `config.ts: 1 addition, 1 deletion
  const config = {
-   port: 3000,
+   port: 8080,
  };`,
    },
    {
      label: "View added file",
      action: "Render",
      input: `--- /dev/null
+++ b/utils.ts
@@ -0,0 +1,3 @@
+export function add(a: number, b: number) {
+  return a + b;
+}`,
      output: `utils.ts (new file): 3 additions
+ export function add(a: number, b: number) {
+   return a + b;
+ }`,
    },
    {
      label: "Multi-file diff stats",
      action: "Render",
      input: `3 files changed, 15 insertions(+), 7 deletions(-)`,
      output: `Files changed: 3
+15 insertions  -7 deletions
Net: +8 lines`,
    },
  ],
  "date-format-tester": [
    {
      label: "Test strftime format",
      action: "Format",
      input: `Format: %Y-%m-%d %H:%M:%S
Date: March 19, 2026`,
      output: `2026-03-19 14:30:00`,
    },
    {
      label: "ISO 8601 format",
      action: "Format",
      input: `Format: YYYY-MM-DDTHH:mm:ssZ
Date: March 19, 2026`,
      output: `2026-03-19T14:30:00+00:00`,
    },
    {
      label: "Human-readable format",
      action: "Format",
      input: `Format: MMMM Do, YYYY
Date: March 19, 2026`,
      output: `March 19th, 2026`,
    },
  ],
  "token-counter": [
    {
      label: "Count GPT-4 tokens",
      action: "Count",
      input: `Hello, how are you doing today?`,
      output: `Tokens: 8
Cost (GPT-4o): $0.00002 input
Context used: 0.006%`,
    },
    {
      label: "Count Claude tokens",
      action: "Count",
      input: `Write a Python function to sort a list of objects by name.`,
      output: `Tokens: 13
Cost (Claude Sonnet): $0.000039 input
Context used: 0.006%`,
    },
    {
      label: "Compare model costs",
      action: "Count",
      input: `[500 word essay on JavaScript]`,
      output: `Tokens: ~650
GPT-4o:       $0.0016
Claude Opus:  $0.0098
Gemini 2.5:   $0.0008`,
    },
  ],
  "regex-generator": [
    {
      label: "Describe a pattern in English",
      action: "Generate",
      input: `Match email addresses`,
      output: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}

Matches: user@example.com, first.last@co.uk`,
    },
    {
      label: "Match phone numbers",
      action: "Generate",
      input: `US phone numbers with optional country code`,
      output: `(\\+1\\s?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}

Matches: +1 (555) 123-4567, 555.123.4567`,
    },
    {
      label: "Extract URLs from text",
      action: "Generate",
      input: `Match HTTP and HTTPS URLs`,
      output: `https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=]+

Matches: https://devbolt.dev/tools`,
    },
  ],
  "file-hash": [
    {
      label: "Calculate SHA-256 of a file",
      action: "Hash",
      input: `[document.pdf]
Size: 2.4 MB`,
      output: `SHA-256: 9f86d081884c7d659a2f...
MD5: 098f6bcd4621d373cade4e832627b4f6
SHA-1: a94a8fe5ccb19ba61c4c0873d391e987982fbbd3`,
    },
    {
      label: "Verify download integrity",
      action: "Hash",
      input: `Expected: 9f86d081884c7d65...
File: [installer.exe]`,
      output: `SHA-256: 9f86d081884c7d65...
Status: Match confirmed
File integrity: Verified`,
    },
    {
      label: "Compare two files",
      action: "Hash",
      input: `File A: [config-v1.json]
File B: [config-v2.json]`,
      output: `File A: 5d41402abc4b2a76b...
File B: 7d793037a0760186b...
Match: No (files differ)`,
    },
  ],
  "svg-optimizer": [
    {
      label: "Remove unnecessary attributes",
      action: "Optimize",
      input: `<svg xmlns="http://www.w3.org/2000/svg"
  width="100" height="100"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1">
  <circle cx="50" cy="50" r="40"
    fill="#ff0000" stroke="#000000"
    stroke-width="2"/>
</svg>`,
      output: `<svg xmlns="http://www.w3.org/2000/svg"
  width="100" height="100">
  <circle cx="50" cy="50" r="40"
    fill="red" stroke="#000"
    stroke-width="2"/>
</svg>
Saved: 18% smaller`,
    },
    {
      label: "Minify SVG markup",
      action: "Minify",
      input: `<svg xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10"
    width="80" height="80"
    fill="blue" rx="5"/>
</svg>`,
      output: `<svg xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="blue" rx="5"/></svg>
Saved: 32% smaller`,
    },
    {
      label: "Clean up editor metadata",
      action: "Optimize",
      input: `<svg xmlns="http://www.w3.org/2000/svg">
  <!-- Created with Inkscape -->
  <metadata>...</metadata>
  <defs><style></style></defs>
  <path d="M10 10 L90 90"/>
</svg>`,
      output: `<svg xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 L90 90"/>
</svg>
Removed: comments, metadata, empty defs`,
    },
  ],
  "image-compressor": [
    {
      label: "Compress JPEG photo",
      action: "Compress",
      input: `[photo.jpg]
Original: 2.4 MB
Quality: 85%`,
      output: `Compressed: 620 KB
Savings: 74%
Dimensions: 1920×1080 (unchanged)`,
    },
    {
      label: "Optimize PNG screenshot",
      action: "Compress",
      input: `[screenshot.png]
Original: 1.8 MB
Quality: 90%`,
      output: `Compressed: 410 KB
Savings: 77%
Colors: reduced to optimal palette`,
    },
    {
      label: "Batch compress multiple images",
      action: "Compress",
      input: `[hero.jpg] 3.1 MB
[thumb.png] 890 KB
[icon.png] 245 KB`,
      output: `hero.jpg: 780 KB (−75%)
thumb.png: 195 KB (−78%)
icon.png: 62 KB (−75%)
Total saved: 3.2 MB`,
    },
  ],
  "flexbox-generator": [
    {
      label: "Center content horizontally & vertically",
      action: "Generate",
      input: `Direction: row
Justify: center
Align: center
Gap: 16px`,
      output: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}`,
    },
    {
      label: "Responsive sidebar layout",
      action: "Generate",
      input: `Direction: row
Wrap: wrap
Children:
  - Sidebar: flex: 0 0 250px
  - Main: flex: 1 1 0`,
      output: `.container {
  display: flex;
  flex-wrap: wrap;
}
.sidebar {
  flex: 0 0 250px;
}
.main {
  flex: 1 1 0;
}`,
    },
    {
      label: "Space-between navigation bar",
      action: "Generate",
      input: `Direction: row
Justify: space-between
Align: center`,
      output: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}`,
    },
  ],
  "grid-generator": [
    {
      label: "3-column responsive grid",
      action: "Generate",
      input: `Columns: 3
Rows: auto
Gap: 24px`,
      output: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}`,
    },
    {
      label: "Dashboard layout with sidebar",
      action: "Generate",
      input: `Columns: 250px 1fr
Rows: 60px 1fr
Areas:
  "header header"
  "sidebar main"`,
      output: `.dashboard {
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-template-rows: 60px 1fr;
  grid-template-areas:
    "header header"
    "sidebar main";
}`,
    },
    {
      label: "Auto-fill responsive cards",
      action: "Generate",
      input: `Columns: auto-fill, min 280px
Gap: 20px`,
      output: `.cards {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}`,
    },
  ],
  "text-shadow": [
    {
      label: "Subtle text glow effect",
      action: "Generate",
      input: `Offset X: 0px
Offset Y: 0px
Blur: 10px
Color: rgba(59, 130, 246, 0.5)`,
      output: `text-shadow: 0px 0px 10px rgba(59, 130, 246, 0.5);`,
    },
    {
      label: "Hard drop shadow",
      action: "Generate",
      input: `Offset X: 3px
Offset Y: 3px
Blur: 0px
Color: #000000`,
      output: `text-shadow: 3px 3px 0px #000000;`,
    },
    {
      label: "Multi-layer neon effect",
      action: "Generate",
      input: `Layer 1: 0 0 7px #fff
Layer 2: 0 0 10px #0ff
Layer 3: 0 0 21px #0ff`,
      output: `text-shadow:
  0 0 7px #fff,
  0 0 10px #0ff,
  0 0 21px #0ff;`,
    },
  ],
  "css-animation": [
    {
      label: "Fade in from bottom",
      action: "Generate",
      input: `Name: fadeInUp
Duration: 0.5s
Timing: ease-out
From: opacity 0, translateY 20px
To: opacity 1, translateY 0`,
      output: `@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.element {
  animation: fadeInUp 0.5s ease-out;
}`,
    },
    {
      label: "Spinning loader",
      action: "Generate",
      input: `Name: spin
Duration: 1s
Timing: linear
Iteration: infinite
From: rotate(0deg)
To: rotate(360deg)`,
      output: `@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.loader {
  animation: spin 1s linear infinite;
}`,
    },
    {
      label: "Pulse scale effect",
      action: "Generate",
      input: `Name: pulse
Duration: 2s
Timing: ease-in-out
Iteration: infinite
0%: scale(1)
50%: scale(1.05)
100%: scale(1)`,
      output: `@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.element {
  animation: pulse 2s ease-in-out infinite;
}`,
    },
  ],
  "meta-tag-generator": [
    {
      label: "Generate SEO meta tags",
      action: "Generate",
      input: `Title: My App - Fast Dev Tools
Description: Free online developer tools
URL: https://example.com
Image: https://example.com/og.png`,
      output: `<title>My App - Fast Dev Tools</title>
<meta name="description"
  content="Free online developer tools"/>
<meta property="og:title"
  content="My App - Fast Dev Tools"/>
<meta property="og:description"
  content="Free online developer tools"/>
<meta property="og:image"
  content="https://example.com/og.png"/>
<meta property="og:url"
  content="https://example.com"/>`,
    },
    {
      label: "Twitter card meta tags",
      action: "Generate",
      input: `Card: summary_large_image
Site: @myapp
Title: Launch Announcement
Image: /social.png`,
      output: `<meta name="twitter:card"
  content="summary_large_image"/>
<meta name="twitter:site" content="@myapp"/>
<meta name="twitter:title"
  content="Launch Announcement"/>
<meta name="twitter:image"
  content="/social.png"/>`,
    },
    {
      label: "Full HTML head with charset & viewport",
      action: "Generate",
      input: `Title: Dashboard
Charset: UTF-8
Viewport: width=device-width
Robots: index, follow`,
      output: `<meta charset="UTF-8"/>
<meta name="viewport"
  content="width=device-width, initial-scale=1"/>
<title>Dashboard</title>
<meta name="robots"
  content="index, follow"/>`,
    },
  ],
  "json-schema": [
    {
      label: "Validate object against schema",
      action: "Validate",
      input: `Schema: { "type": "object",
  "required": ["name", "age"] }
Data: { "name": "Alice", "age": 30 }`,
      output: `✓ Valid
All required properties present
Type checks passed: 2/2`,
    },
    {
      label: "Catch type mismatch error",
      action: "Validate",
      input: `Schema: { "type": "object",
  "properties": {
    "port": { "type": "integer" }
  }}
Data: { "port": "3000" }`,
      output: `✗ Invalid
Error at /port:
  Expected integer, got string
  Value: "3000"`,
    },
    {
      label: "Validate with pattern constraint",
      action: "Validate",
      input: `Schema: { "properties": {
  "email": {
    "type": "string",
    "pattern": "^[^@]+@[^@]+$"
  }}}
Data: { "email": "not-an-email" }`,
      output: `✗ Invalid
Error at /email:
  String does not match pattern
  Pattern: ^[^@]+@[^@]+$
  Value: "not-an-email"`,
    },
  ],
  "subnet-calculator": [
    {
      label: "Calculate subnet details",
      action: "Calculate",
      input: `IP: 192.168.1.0
CIDR: /24`,
      output: `Network: 192.168.1.0/24
Netmask: 255.255.255.0
Broadcast: 192.168.1.255
Hosts: 254 usable
Range: 192.168.1.1 – .254`,
    },
    {
      label: "Check if IP is in subnet",
      action: "Check",
      input: `Subnet: 10.0.0.0/16
IP: 10.0.5.42`,
      output: `✓ 10.0.5.42 is within 10.0.0.0/16
Network range: 10.0.0.1 – 10.0.255.254
Position: host #1,322 of 65,534`,
    },
    {
      label: "Subdivide into smaller subnets",
      action: "Subdivide",
      input: `Network: 172.16.0.0/16
Split into: /24 subnets`,
      output: `256 subnets of /24:
172.16.0.0/24 (254 hosts)
172.16.1.0/24 (254 hosts)
172.16.2.0/24 (254 hosts)
... 253 more subnets`,
    },
  ],
  "gitignore-generator": [
    {
      label: "Generate for Node.js project",
      action: "Generate",
      input: `Framework: Node.js
Extras: macOS, VS Code`,
      output: `# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local

# macOS
.DS_Store

# VS Code
.vscode/settings.json`,
    },
    {
      label: "Generate for Python project",
      action: "Generate",
      input: `Framework: Python
Extras: PyCharm, venv`,
      output: `# Virtual environments
venv/
.venv/
__pycache__/
*.pyc

# Distribution
dist/
*.egg-info/

# PyCharm
.idea/

# Environment
.env`,
    },
    {
      label: "Generate for Go project",
      action: "Generate",
      input: `Framework: Go
Extras: VS Code`,
      output: `# Binaries
*.exe
*.dll
*.so
*.dylib

# Build output
/bin/
/vendor/

# VS Code
.vscode/

# Environment
.env`,
    },
  ],
  "cron-generator": [
    {
      label: "Every weekday at 9 AM",
      action: "Generate",
      input: `Frequency: Daily
Time: 9:00 AM
Days: Mon-Fri`,
      output: `0 9 * * 1-5

Runs at 09:00 every weekday
Next: Mon Mar 23, 2026 09:00`,
    },
    {
      label: "Every 6 hours",
      action: "Generate",
      input: `Frequency: Every N hours
Interval: 6`,
      output: `0 */6 * * *

Runs at 00:00, 06:00, 12:00, 18:00
Next: today at next 6-hour mark`,
    },
    {
      label: "First Monday of each month",
      action: "Generate",
      input: `Frequency: Monthly
Day: First Monday
Time: 8:00 AM`,
      output: `0 8 1-7 * 1

Runs at 08:00 on the first Monday
Next: Mon Apr 6, 2026 08:00`,
    },
  ],
  "favicon-generator": [
    {
      label: "Generate from emoji",
      action: "Generate",
      input: `Type: Emoji
Emoji: ⚡
Sizes: 16, 32, 180, 192, 512`,
      output: `Generated 5 favicons:
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png (180×180)
├── android-chrome-192x192.png
└── android-chrome-512x512.png`,
    },
    {
      label: "Generate from text initials",
      action: "Generate",
      input: `Type: Text
Text: DB
Background: #3b82f6
Color: #ffffff`,
      output: `Generated favicon set:
├── favicon.ico (16×16, 32×32)
├── favicon.svg
├── apple-touch-icon.png
└── site.webmanifest`,
    },
    {
      label: "Generate HTML link tags",
      action: "Generate",
      input: `Include: All standard sizes
Path: /icons/`,
      output: `<link rel="icon" href="/icons/favicon.ico"
  sizes="32x32"/>
<link rel="icon" href="/icons/icon.svg"
  type="image/svg+xml"/>
<link rel="apple-touch-icon"
  href="/icons/apple-touch-icon.png"/>`,
    },
  ],
  "tailwind-generator": [
    {
      label: "Generate card component",
      action: "Generate",
      input: `Component: Card
Shadow: medium
Rounded: large
Padding: 6`,
      output: `<div class="rounded-lg shadow-md p-6
  bg-white dark:bg-gray-800">
  <h3 class="text-lg font-semibold
    text-gray-900 dark:text-white">
    Card Title
  </h3>
  <p class="mt-2 text-gray-600
    dark:text-gray-300">
    Card content here
  </p>
</div>`,
    },
    {
      label: "Generate responsive navbar",
      action: "Generate",
      input: `Component: Navbar
Style: Sticky top
Background: blur`,
      output: `<nav class="sticky top-0 z-50
  backdrop-blur-md bg-white/80
  dark:bg-gray-900/80
  border-b border-gray-200
  dark:border-gray-700">
  <div class="max-w-7xl mx-auto px-4
    flex items-center justify-between
    h-16">
  </div>
</nav>`,
    },
    {
      label: "Generate button variants",
      action: "Generate",
      input: `Component: Button
Variants: primary, secondary, danger`,
      output: `/* Primary */
class="px-4 py-2 rounded-lg
  bg-blue-600 text-white
  hover:bg-blue-700"

/* Secondary */
class="px-4 py-2 rounded-lg
  border border-gray-300
  hover:bg-gray-50"

/* Danger */
class="px-4 py-2 rounded-lg
  bg-red-600 text-white
  hover:bg-red-700"`,
    },
  ],
  "og-preview": [
    {
      label: "Preview Open Graph tags",
      action: "Preview",
      input: `URL: https://devbolt.dev/tools/json-formatter`,
      output: `og:title: JSON Formatter & Validator
og:description: Format, validate,
  and minify JSON — free, client-side
og:image: /og/json-formatter.png
og:type: website
Twitter card: summary_large_image`,
    },
    {
      label: "Debug missing OG image",
      action: "Debug",
      input: `URL: https://example.com/blog/post-1`,
      output: `⚠ Issues found:
✗ og:image — missing
✓ og:title — "My Blog Post"
✓ og:description — present (148 chars)
⚠ twitter:card — missing
Fix: Add og:image meta tag`,
    },
    {
      label: "Preview social share cards",
      action: "Preview",
      input: `Title: DevBolt — 117 Free Dev Tools
Description: Privacy-first tools
Image: https://devbolt.dev/og.png`,
      output: `Twitter (large image):
┌──────────────────────┐
│    [OG Image]        │
│ DevBolt — 117 Free.. │
│ Privacy-first tools  │
│ devbolt.dev          │
└──────────────────────┘`,
    },
  ],
  "js-playground": [
    {
      label: "Run JavaScript instantly",
      action: "Run",
      input: `const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);
console.log("Avg:", sum / nums.length);`,
      output: `Sum: 5
Avg: 3`,
    },
    {
      label: "Test async/await code",
      action: "Run",
      input: `async function fetchData() {
  const delay = ms =>
    new Promise(r => setTimeout(r, ms));
  await delay(100);
  return { status: "ok", items: 42 };
}
const data = await fetchData();
console.log(data);`,
      output: `{ status: "ok", items: 42 }`,
    },
    {
      label: "Prototype array methods",
      action: "Run",
      input: `const users = [
  { name: "Alice", age: 28 },
  { name: "Bob", age: 34 },
  { name: "Eve", age: 22 },
];
const names = users
  .filter(u => u.age > 25)
  .map(u => u.name);
console.log(names);`,
      output: `["Alice", "Bob"]`,
    },
  ],
  "docker-compose": [
    {
      label: "Validate docker-compose.yml",
      action: "Validate",
      input: `version: "3.8"
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret`,
      output: `✓ Valid Docker Compose file
Services: 2 (web, db)
Networks: 1 (default)
Volumes: 0
Version: 3.8`,
    },
    {
      label: "Catch indentation error",
      action: "Validate",
      input: `services:
  web:
    image: nginx
  ports:
    - "80:80"`,
      output: `✗ Invalid
Error at line 4:
  "ports" must be nested under
  a service, not at root level
Fix: indent "ports:" under "web:"`,
    },
    {
      label: "Detect deprecated options",
      action: "Validate",
      input: `version: "2"
services:
  app:
    image: node:20
    links:
      - db
  db:
    image: mongo:7`,
      output: `⚠ Warnings:
- "links" is deprecated, use networks
- "version" field is obsolete
  in Compose V2
Suggestion: Remove version, use
  depends_on instead of links`,
    },
  ],
  "privacy-policy": [
    {
      label: "Generate basic privacy policy",
      action: "Generate",
      input: `Company: Acme Inc
Website: https://acme.com
Email: privacy@acme.com
Data: email, name
Analytics: Google Analytics`,
      output: `Privacy Policy — Acme Inc
Effective: March 19, 2026

1. Information We Collect
We collect: email address, name

2. How We Use Your Information
- Provide our services
- Send communications

3. Analytics
We use Google Analytics...
[Full policy generated]`,
    },
    {
      label: "Add GDPR compliance section",
      action: "Generate",
      input: `Region: EU/EEA
DPO: dpo@acme.com
Legal basis: Consent
Data transfers: US`,
      output: `GDPR Rights (EU/EEA Users):
- Right to access your data
- Right to rectification
- Right to erasure
- Right to data portability
- Right to withdraw consent

DPO Contact: dpo@acme.com
Data transfers: EU → US
(Standard Contractual Clauses)`,
    },
    {
      label: "Generate cookie notice",
      action: "Generate",
      input: `Cookies: essential, analytics
Third-party: Google, Stripe
Consent: opt-in`,
      output: `Cookie Policy

Essential cookies: Required for
  site functionality (always active)

Analytics cookies: Google Analytics
  (opt-in, consent required)

Payment: Stripe session cookies
  (functional, transaction only)

You can manage preferences via
our cookie banner at any time.`,
    },
  ],
  "http-status-codes": [
    {
      label: "Look up status code",
      action: "Search",
      input: `Code: 429`,
      output: `429 Too Many Requests

Category: Client Error (4xx)
Meaning: Rate limit exceeded

Common headers:
  Retry-After: 60
  X-RateLimit-Remaining: 0

Use when: API rate limiting,
  throttling user requests`,
    },
    {
      label: "Find redirect codes",
      action: "Search",
      input: `Category: 3xx Redirects`,
      output: `301 Moved Permanently
  → SEO-safe, cached by browsers
302 Found (Temporary)
  → Not cached, original URL kept
307 Temporary Redirect
  → Preserves HTTP method
308 Permanent Redirect
  → Like 301, preserves method`,
    },
    {
      label: "Compare 401 vs 403",
      action: "Compare",
      input: `Codes: 401, 403`,
      output: `401 Unauthorized
  → Not authenticated
  → "Who are you?"
  → Fix: send valid credentials

403 Forbidden
  → Authenticated but not allowed
  → "I know who you are, but no"
  → Fix: request proper permissions`,
    },
  ],
  "json-mock-generator": [
    {
      label: "Generate mock user data",
      action: "Generate",
      input: `Schema: User
Fields: id, name, email, age
Count: 3`,
      output: `[
  { "id": 1,
    "name": "Alice Chen",
    "email": "alice@example.com",
    "age": 28 },
  { "id": 2,
    "name": "Bob Smith",
    "email": "bob@example.com",
    "age": 34 },
  { "id": 3,
    "name": "Eve Johnson",
    "email": "eve@example.com",
    "age": 22 }
]`,
    },
    {
      label: "Generate nested API response",
      action: "Generate",
      input: `Schema: API Response
Fields: status, data.users[],
  data.pagination`,
      output: `{
  "status": "success",
  "data": {
    "users": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ],
    "pagination": {
      "page": 1,
      "total": 50,
      "perPage": 10
    }
  }
}`,
    },
    {
      label: "Generate product catalog",
      action: "Generate",
      input: `Schema: Product
Fields: id, name, price, inStock
Count: 2`,
      output: `[
  { "id": "prod_001",
    "name": "Wireless Keyboard",
    "price": 79.99,
    "inStock": true },
  { "id": "prod_002",
    "name": "USB-C Hub",
    "price": 49.99,
    "inStock": false }
]`,
    },
  ],
  "readme-generator": [
    {
      label: "Generate project README",
      action: "Generate",
      input: `Name: my-api
Description: REST API for task mgmt
Tech: Node.js, Express, PostgreSQL
License: MIT`,
      output: `# my-api

REST API for task management

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

## Tech Stack
- Node.js + Express
- PostgreSQL

## License
MIT`,
    },
    {
      label: "Add badges and install section",
      action: "Generate",
      input: `Badges: npm version, license, CI
Install: npm install my-api
Usage: import { createApp }`,
      output: `![npm](https://img.shields.io/npm/v/my-api)
![license](https://img.shields.io/badge/license-MIT-blue)
![CI](https://img.shields.io/github/actions/...)

## Installation
\`\`\`bash
npm install my-api
\`\`\`

## Usage
\`\`\`js
import { createApp } from 'my-api';
\`\`\``,
    },
    {
      label: "Generate contributing guide",
      action: "Generate",
      input: `Contributing: yes
Branch: feature/*
Tests: required
PR template: yes`,
      output: `## Contributing
1. Fork the repository
2. Create a feature branch
   \`git checkout -b feature/my-feature\`
3. Run tests: \`npm test\`
4. Submit a pull request

All PRs require passing CI and
at least one review.`,
    },
  ],
  "dockerfile-validator": [
    {
      label: "Validate Dockerfile",
      action: "Validate",
      input: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
      output: `✓ Valid Dockerfile
Base image: node:20-alpine
Stages: 1
Instructions: 6
Best practices: all passed`,
    },
    {
      label: "Detect security issues",
      action: "Validate",
      input: `FROM node:latest
RUN npm install
COPY . .
USER root
CMD node app.js`,
      output: `⚠ 3 issues found:
✗ Use specific tag, not "latest"
✗ Running as root — add USER node
⚠ Use "npm ci" instead of
  "npm install" for reproducibility
⚠ CMD should use exec form:
  ["node", "app.js"]`,
    },
    {
      label: "Suggest multi-stage build",
      action: "Analyze",
      input: `FROM node:20
RUN npm install -g typescript
COPY . .
RUN tsc
CMD ["node", "dist/index.js"]`,
      output: `⚠ Suggestion: multi-stage build
Build stage has dev dependencies
in production image.

Recommended:
  FROM node:20 AS builder
  ... (build step)
  FROM node:20-alpine
  COPY --from=builder /app/dist .
  CMD ["node", "index.js"]`,
    },
  ],
  "k8s-validator": [
    {
      label: "Validate Deployment YAML",
      action: "Validate",
      input: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:1.25`,
      output: `✓ Valid Deployment
API: apps/v1
Replicas: 3
Containers: 1 (web)
Image: nginx:1.25`,
    },
    {
      label: "Catch missing required field",
      action: "Validate",
      input: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: api
        image: myapp:v1`,
      output: `✗ Invalid
Error: spec.selector is required
  for Deployment in apps/v1
Fix: Add selector.matchLabels
  matching template labels`,
    },
    {
      label: "Detect resource limits missing",
      action: "Validate",
      input: `spec:
  containers:
  - name: app
    image: myapp:latest
    ports:
    - containerPort: 8080`,
      output: `⚠ Best practice warnings:
✗ No resource requests/limits set
✗ Using "latest" tag — pin version
⚠ No liveness/readiness probes
⚠ No security context defined
Suggestion: Add resources.limits
  cpu: "500m", memory: "256Mi"`,
    },
  ],
  "robots-generator": [
    {
      label: "Generate standard robots.txt",
      action: "Generate",
      input: `Allow: all pages
Disallow: /admin, /api
Sitemap: https://example.com/sitemap.xml`,
      output: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap.xml`,
    },
    {
      label: "Block specific crawlers",
      action: "Generate",
      input: `Block: GPTBot, CCBot
Allow: Googlebot, Bingbot
Crawl-delay: 10`,
      output: `User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
Crawl-delay: 10`,
    },
    {
      label: "Block all crawlers (staging)",
      action: "Generate",
      input: `Environment: Staging
Block: everything`,
      output: `# Staging — block all crawlers
User-agent: *
Disallow: /`,
    },
  ],
  "openapi-validator": [
    {
      label: "Validate OpenAPI 3.0 spec",
      action: "Validate",
      input: `openapi: "3.0.3"
info:
  title: Users API
  version: "1.0"
paths:
  /users:
    get:
      summary: List users
      responses:
        "200":
          description: OK`,
      output: `✓ Valid OpenAPI 3.0.3
Paths: 1
Operations: 1 (GET /users)
Schemas: 0
No errors or warnings`,
    },
    {
      label: "Detect missing required fields",
      action: "Validate",
      input: `openapi: "3.0.3"
paths:
  /users:
    get:
      responses:
        "200":
          description: OK`,
      output: `✗ Invalid
Error: "info" is required
  Missing: info.title, info.version
Paths validated: 1
Fix: Add info object with title
  and version fields`,
    },
    {
      label: "Check schema references",
      action: "Validate",
      input: `paths:
  /users:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"`,
      output: `✗ Reference error
$ref "#/components/schemas/User"
  not found in components.schemas
Fix: Define User schema in
  components.schemas section`,
    },
  ],
  "zod-schema": [
    {
      label: "Generate Zod schema from types",
      action: "Generate",
      input: `interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}`,
      output: `const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
});

type User = z.infer<typeof UserSchema>;`,
    },
    {
      label: "Generate with validation rules",
      action: "Generate",
      input: `interface CreateUser {
  name: string; // min 2, max 50
  age: number; // min 18
  email: string;
  password: string; // min 8
}`,
      output: `const CreateUserSchema = z.object({
  name: z.string().min(2).max(50),
  age: z.number().int().min(18),
  email: z.string().email(),
  password: z.string().min(8),
});`,
    },
    {
      label: "Generate nested schema",
      action: "Generate",
      input: `interface Order {
  id: string;
  items: OrderItem[];
  total: number;
}
interface OrderItem {
  productId: string;
  quantity: number;
}`,
      output: `const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const OrderSchema = z.object({
  id: z.string(),
  items: z.array(OrderItemSchema),
  total: z.number().positive(),
});`,
    },
  ],
  "placeholder-image": [
    {
      label: "Generate placeholder image",
      action: "Generate",
      input: `Width: 800
Height: 600
Background: #e2e8f0
Text: 800 × 600`,
      output: `[Generated image: 800×600]
Background: #e2e8f0
Text: "800 × 600" (centered)
Format: PNG
Size: ~2 KB`,
    },
    {
      label: "Generate avatar placeholder",
      action: "Generate",
      input: `Width: 128
Height: 128
Background: #3b82f6
Text: AB
Rounded: circle`,
      output: `[Generated avatar: 128×128]
Shape: Circle
Background: #3b82f6
Text: "AB" (white, centered)
Format: PNG`,
    },
    {
      label: "Generate social media size",
      action: "Generate",
      input: `Preset: Twitter Header
Width: 1500
Height: 500
Text: Cover Image`,
      output: `[Generated image: 1500×500]
Preset: Twitter Header
Background: #94a3b8
Text: "Cover Image"
Format: PNG
Download ready`,
    },
  ],
  "nginx-config": [
    {
      label: "Generate reverse proxy config",
      action: "Generate",
      input: `Type: Reverse Proxy
Domain: api.example.com
Upstream: localhost:3000
SSL: yes`,
      output: `server {
  listen 443 ssl http2;
  server_name api.example.com;

  ssl_certificate /etc/ssl/cert.pem;
  ssl_certificate_key /etc/ssl/key.pem;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP
      $remote_addr;
  }
}`,
    },
    {
      label: "Generate static site config",
      action: "Generate",
      input: `Type: Static Site
Domain: example.com
Root: /var/www/html
Gzip: enabled`,
      output: `server {
  listen 80;
  server_name example.com;
  root /var/www/html;
  index index.html;

  gzip on;
  gzip_types text/css
    application/javascript
    application/json;

  location / {
    try_files $uri $uri/ =404;
  }
}`,
    },
    {
      label: "Generate SPA with fallback",
      action: "Generate",
      input: `Type: SPA
Domain: app.example.com
Root: /var/www/app/dist
Fallback: index.html`,
      output: `server {
  listen 80;
  server_name app.example.com;
  root /var/www/app/dist;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /assets {
    expires 1y;
    add_header Cache-Control
      "public, immutable";
  }
}`,
    },
  ],
  "env-validator": [
    {
      label: "Validate .env file",
      action: "Validate",
      input: `DATABASE_URL=postgres://localhost/db
API_KEY=sk-abc123
PORT=3000
DEBUG=true
SECRET=`,
      output: `✓ 4 valid variables
⚠ 1 issue:
  SECRET — empty value
  (may cause runtime errors)

Variables: 5 total
Types: 2 URLs, 1 number,
  1 boolean, 1 empty`,
    },
    {
      label: "Compare .env and .env.example",
      action: "Compare",
      input: `.env.example:
  DATABASE_URL=
  API_KEY=
  REDIS_URL=
  PORT=

.env:
  DATABASE_URL=postgres://...
  API_KEY=sk-123
  PORT=3000`,
      output: `⚠ Missing from .env:
  REDIS_URL (defined in .env.example)

✓ Present: DATABASE_URL, API_KEY, PORT
Extra in .env: (none)

Coverage: 3/4 (75%)`,
    },
    {
      label: "Detect security issues",
      action: "Validate",
      input: `DB_PASS=password123
JWT_SECRET=secret
AWS_KEY=AKIAIOSFODNN7EXAMPLE
PRIVATE_KEY="-----BEGIN RSA..."`,
      output: `✗ 4 security warnings:
✗ DB_PASS — weak password
✗ JWT_SECRET — too short/simple
⚠ AWS_KEY — looks like real AWS key
  (starts with AKIA)
⚠ PRIVATE_KEY — private key in .env
  (use file reference instead)`,
    },
  ],
  "ascii-art": [
    {
      label: "Generate ASCII text banner",
      action: "Generate",
      input: `Text: HELLO
Font: Standard`,
      output: `  _   _ _____ _     _     ___
 | | | | ____| |   | |   / _ \\
 | |_| |  _| | |   | |  | | | |
 |  _  | |___| |___| |__| |_| |
 |_| |_|_____|_____|_____\\___/`,
    },
    {
      label: "Generate with block font",
      action: "Generate",
      input: `Text: DEV
Font: Block`,
      output: `  ____  _______     __
 |  _ \\| ____\\ \\   / /
 | | | |  _|  \\ \\ / /
 | |_| | |___  \\ V /
 |____/|_____|  \\_/`,
    },
    {
      label: "Generate small text",
      action: "Generate",
      input: `Text: OK
Font: Mini`,
      output: `  ___  _  __
 / _ \\| |/ /
| | | | ' /
| |_| | . \\
 \\___/|_|\\_\\`,
    },
  ],
  "ai-model-comparison": [
    {
      label: "Compare GPT-4o vs Claude Sonnet",
      action: "Compare",
      input: `Models: GPT-4o, Claude 3.5 Sonnet
Compare: price, context, speed`,
      output: `            GPT-4o    Claude 3.5
Input:      $2.50/M   $3.00/M
Output:     $10.00/M  $15.00/M
Context:    128K      200K
Speed:      Fast      Fast
Reasoning:  ✓         ✓
Vision:     ✓         ✓`,
    },
    {
      label: "Filter open-source models",
      action: "Filter",
      input: `Filter: Open Source
Sort by: context window`,
      output: `Llama 3.1 405B — 128K context
Llama 3.1 70B — 128K context
Mistral Large 2 — 128K context
DeepSeek V3 — 128K context
Llama 3.1 8B — 128K context`,
    },
    {
      label: "Find cheapest coding model",
      action: "Filter",
      input: `Filter: Reasoning capable
Sort by: price (lowest first)`,
      output: `DeepSeek R1 — $0.55/$2.19/M
Gemini 2.0 Flash — $0.10/$0.40/M
GPT-4o mini — $0.15/$0.60/M
Claude Haiku 3.5 — $0.80/$4.00/M
GPT-4o — $2.50/$10.00/M`,
    },
  ],
  "git-command-builder": [
    {
      label: "Build interactive rebase command",
      action: "Build",
      input: `Action: Rebase
Type: Interactive
Commits: last 5`,
      output: `git rebase -i HEAD~5

⚠ This rewrites history.
Don't use on shared branches.`,
    },
    {
      label: "Build cherry-pick command",
      action: "Build",
      input: `Action: Cherry-pick
Commit: abc1234
No commit: yes`,
      output: `git cherry-pick --no-commit abc1234

Applies changes without committing,
so you can modify before commit.`,
    },
    {
      label: "Build stash with message",
      action: "Build",
      input: `Action: Stash
Message: WIP: auth flow
Include untracked: yes`,
      output: `git stash push -u -m "WIP: auth flow"

-u includes untracked files
Retrieve later: git stash pop`,
    },
  ],
  "csp-builder": [
    {
      label: "Build strict CSP header",
      action: "Build",
      input: `default-src: 'self'
script-src: 'self'
style-src: 'self' 'unsafe-inline'
img-src: 'self' data:
connect-src: 'self' https://api.example.com`,
      output: `Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self'
    https://api.example.com;`,
    },
    {
      label: "Build CSP for Next.js app",
      action: "Build",
      input: `Preset: Next.js
Analytics: Google Analytics
Fonts: Google Fonts`,
      output: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-eval'
    https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline'
    https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  img-src 'self' data: blob:;`,
    },
    {
      label: "Add reporting endpoint",
      action: "Build",
      input: `Policy: existing strict CSP
Report: https://csp.example.com/report
Mode: report-only`,
      output: `Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self';
  report-uri
    https://csp.example.com/report;
  report-to csp-endpoint;`,
    },
  ],
  "code-screenshot": [
    {
      label: "Generate code screenshot",
      action: "Capture",
      input: `const greet = (name: string) => {
  return \`Hello, \${name}!\`;
};
Theme: Dracula
Language: TypeScript`,
      output: `[Screenshot generated]
Theme: Dracula (dark purple)
Size: 800×400 @2x Retina
Window chrome: macOS style
Line numbers: enabled
Format: PNG`,
    },
    {
      label: "Social-ready code card",
      action: "Capture",
      input: `// Quick tip: nullish coalescing
const port = config.port ?? 3000;
Theme: Nord
Background: gradient`,
      output: `[Screenshot generated]
Theme: Nord (arctic blue)
Background: blue→purple gradient
Padding: 64px
Format: PNG (1200×630)
Ready for Twitter/LinkedIn`,
    },
    {
      label: "Minimal code snippet",
      action: "Capture",
      input: `git rebase -i HEAD~3
Theme: GitHub Light
No chrome: true`,
      output: `[Screenshot generated]
Theme: GitHub Light
No window chrome
No line numbers
Clean, minimal style
Copied to clipboard`,
    },
  ],
  "json-visualizer": [
    {
      label: "Visualize nested JSON tree",
      action: "Visualize",
      input: `{
  "user": {
    "name": "Alice",
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  }
}`,
      output: `▼ {} root (1 key)
  ▼ {} user (2 keys)
      name: "Alice"
    ▼ {} settings (2 keys)
        theme: "dark"
        notifications: true

Depth: 3 | Keys: 4 | Size: 89B`,
    },
    {
      label: "Explore array data",
      action: "Visualize",
      input: `{
  "items": [
    { "id": 1, "name": "A" },
    { "id": 2, "name": "B" }
  ],
  "total": 2
}`,
      output: `▼ {} root (2 keys)
  ▼ [] items (2 items)
    ▼ {} [0] (2 keys)
        id: 1
        name: "A"
    ▼ {} [1] (2 keys)
        id: 2
        name: "B"
    total: 2`,
    },
    {
      label: "Search and filter keys",
      action: "Search",
      input: `Search: "email"
Data: { deep nested object... }`,
      output: `Found 3 matches for "email":
  $.user.email → "alice@example.com"
  $.contacts[0].email → "bob@test.com"
  $.settings.emailNotify → true

Paths copied to clipboard`,
    },
  ],
  "prompt-builder": [
    {
      label: "Build code review prompt",
      action: "Build",
      input: `Template: Code Review
Language: TypeScript
Focus: security, performance
Code: [paste code here]`,
      output: `You are a senior TypeScript engineer
performing a security and performance
code review.

Review this code for:
1. Security vulnerabilities (injection,
   XSS, auth issues)
2. Performance bottlenecks
3. Best practices violations

Code:
\`\`\`typescript
{{code}}
\`\`\`

Provide findings as a numbered list
with severity (critical/warning/info).`,
    },
    {
      label: "Build API documentation prompt",
      action: "Build",
      input: `Template: API Docs
Format: OpenAPI
Endpoints: /users, /orders`,
      output: `Generate OpenAPI 3.0 documentation
for these REST API endpoints:

{{endpoints}}

For each endpoint include:
- HTTP method and path
- Request/response schemas
- Query parameters
- Error responses (400, 401, 404, 500)
- Example request/response

Output as valid YAML.`,
    },
    {
      label: "Build unit test prompt",
      action: "Build",
      input: `Template: Unit Tests
Framework: Vitest
Coverage: edge cases`,
      output: `Write unit tests using Vitest for:

\`\`\`typescript
{{code}}
\`\`\`

Requirements:
- Test happy path and edge cases
- Test error handling
- Use describe/it blocks
- Mock external dependencies
- Aim for >90% coverage`,
    },
  ],
  "mcp-config-builder": [
    {
      label: "Build MCP server config",
      action: "Build",
      input: `Servers:
  - filesystem (read-only)
  - github (with token)
  - sqlite (local db)`,
      output: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y",
        "@modelcontextprotocol/
        server-filesystem",
        "/home/user/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y",
        "@modelcontextprotocol/
        server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}`,
    },
    {
      label: "Add custom MCP server",
      action: "Build",
      input: `Type: Custom server
Command: python
Script: ./my_server.py
Args: --port 8080`,
      output: `{
  "mcpServers": {
    "custom": {
      "command": "python",
      "args": ["./my_server.py",
        "--port", "8080"]
    }
  }
}`,
    },
    {
      label: "Configure for Claude Desktop",
      action: "Build",
      input: `App: Claude Desktop
Servers: filesystem, brave-search
OS: macOS`,
      output: `Config path:
~/Library/Application Support/
  Claude/claude_desktop_config.json

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y",
        "@modelcontextprotocol/
        server-filesystem",
        "/Users/you/Documents"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y",
        "@modelcontextprotocol/
        server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "..."
      }
    }
  }
}`,
    },
  ],
  "openapi-to-typescript": [
    {
      label: "Convert schema to TypeScript",
      action: "Convert",
      input: `components:
  schemas:
    User:
      type: object
      required: [id, name, email]
      properties:
        id: { type: integer }
        name: { type: string }
        email: { type: string }
        role:
          type: string
          enum: [admin, user, guest]`,
      output: `export interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "user" | "guest";
}`,
    },
    {
      label: "Generate API client types",
      action: "Convert",
      input: `paths:
  /users:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/.../User"
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/.../CreateUser"`,
      output: `export interface GetUsersResponse {
  data: User[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export type CreateUserResponse = User;`,
    },
    {
      label: "Handle nullable and oneOf",
      action: "Convert",
      input: `Payment:
  oneOf:
    - $ref: "#/.../CreditCard"
    - $ref: "#/.../BankTransfer"
Amount:
  type: number
  nullable: true`,
      output: `export type Payment =
  | CreditCard
  | BankTransfer;

export type Amount = number | null;`,
    },
  ],
  "jwt-builder": [
    {
      label: "Build authentication JWT",
      action: "Build",
      input: `Algorithm: HS256
Secret: my-secret-key
Claims:
  sub: user_123
  role: admin
  exp: 1 hour`,
      output: `Header: {"alg":"HS256","typ":"JWT"}

Payload: {
  "sub": "user_123",
  "role": "admin",
  "iat": 1742515200,
  "exp": 1742518800
}

eyJhbGciOiJIUzI1NiIs...
  .eyJzdWIiOiJ1c2VyXz...
  .SflKxwRJSMeKKF2QT4f...`,
    },
    {
      label: "Build API key token",
      action: "Build",
      input: `Algorithm: RS256
Claims:
  iss: api.example.com
  aud: client_app
  scope: read write
Key: [generate RSA pair]`,
      output: `Generated RSA-2048 key pair

Payload: {
  "iss": "api.example.com",
  "aud": "client_app",
  "scope": "read write",
  "iat": 1742515200,
  "jti": "f47ac10b-58cc..."
}

Token: eyJhbGciOiJSUzI1...`,
    },
    {
      label: "Build minimal token",
      action: "Build",
      input: `Algorithm: HS256
Secret: test
Claims:
  user: alice
  exp: 5 minutes`,
      output: `Payload: {
  "user": "alice",
  "iat": 1742515200,
  "exp": 1742515500
}

Token: eyJhbGci...eyJ1c2Vy...
Expires in: 5 minutes
→ Open in JWT Decoder to verify`,
    },
  ],
  "tsconfig-builder": [
    {
      label: "Build Next.js tsconfig",
      action: "Build",
      input: `Preset: Next.js App Router
Strict: yes
Target: ES2022`,
      output: `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable",
      "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts",
    "**/*.ts", "**/*.tsx"]
}`,
    },
    {
      label: "Build Node.js ESM config",
      action: "Build",
      input: `Preset: Node.js ESM
Target: ES2022
Output: dist/`,
      output: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}`,
    },
    {
      label: "Build library config",
      action: "Build",
      input: `Preset: npm Library
Declaration: yes
Source maps: yes`,
      output: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["**/*.test.ts"]
}`,
    },
  ],
  "graphql-to-typescript": [
    {
      label: "Convert type definitions",
      action: "Convert",
      input: `type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
}`,
      output: `export interface User {
  id: string;
  name: string;
  email: string;
  posts: Post[];
}

export interface Post {
  id: string;
  title: string;
  content: string | null;
}`,
    },
    {
      label: "Convert enum and union types",
      action: "Convert",
      input: `enum Role {
  ADMIN
  USER
  GUEST
}

union SearchResult = User | Post

input CreateUserInput {
  name: String!
  role: Role!
}`,
      output: `export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export type SearchResult = User | Post;

export interface CreateUserInput {
  name: string;
  role: Role;
}`,
    },
    {
      label: "Convert with custom scalars",
      action: "Convert",
      input: `scalar DateTime
scalar JSON

type Event {
  id: ID!
  startDate: DateTime!
  metadata: JSON
}`,
      output: `export type DateTime = string;
export type JSON = Record<string, unknown>;

export interface Event {
  id: string;
  startDate: DateTime;
  metadata: JSON | null;
}`,
    },
  ],
  "package-json-generator": [
    {
      label: "Generate Next.js package.json",
      action: "Generate",
      input: `Preset: Next.js App
Name: my-app
Version: 1.0.0
Private: yes`,
      output: `{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`,
    },
    {
      label: "Generate npm library config",
      action: "Generate",
      input: `Preset: npm Library
Name: my-utils
Type: module
Exports: ./dist/index.js`,
      output: `{
  "name": "my-utils",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsc",
    "test": "vitest"
  },
  "files": ["dist"]
}`,
    },
    {
      label: "Generate CLI tool config",
      action: "Generate",
      input: `Preset: Node.js CLI
Name: my-cli
Bin: ./bin/cli.js
Engine: node >= 20`,
      output: `{
  "name": "my-cli",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "my-cli": "./bin/cli.js"
  },
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "start": "node bin/cli.js",
    "test": "vitest"
  }
}`,
    },
  ],
  "security-headers": [
    {
      label: "Generate strict security headers",
      action: "Generate",
      input: `Preset: Strict
Output: Nginx`,
      output: `# Security Headers — Strict
add_header Strict-Transport-Security
  "max-age=63072000; includeSubDomains;
  preload" always;
add_header X-Content-Type-Options
  "nosniff" always;
add_header X-Frame-Options
  "DENY" always;
add_header Referrer-Policy
  "strict-origin-when-cross-origin";
add_header Permissions-Policy
  "camera=(), microphone=(),
  geolocation=()";

Security Score: A+`,
    },
    {
      label: "Generate Vercel headers",
      action: "Generate",
      input: `Preset: Moderate
Output: Vercel (vercel.json)`,
      output: `{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options",
        "value": "nosniff" },
      { "key": "X-Frame-Options",
        "value": "SAMEORIGIN" },
      { "key": "Referrer-Policy",
        "value": "strict-origin-when-
          cross-origin" }
    ]
  }]
}
Security Score: B+`,
    },
    {
      label: "Analyze existing headers",
      action: "Analyze",
      input: `X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN`,
      output: `Score: C (4/12 headers set)
✓ X-Content-Type-Options
✓ X-Frame-Options
✗ Missing: HSTS (critical)
✗ Missing: CSP (critical)
✗ Missing: Referrer-Policy
✗ Missing: Permissions-Policy
Recommendation: Add HSTS and CSP`,
    },
  ],
  "sql-to-typescript": [
    {
      label: "Convert to TypeScript interface",
      action: "Convert",
      input: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  age INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);`,
      output: `export interface User {
  id: number;
  name: string;
  email: string;
  age: number | null;
  createdAt: Date;
}`,
    },
    {
      label: "Convert to Prisma schema",
      action: "Convert",
      input: `CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  author_id INTEGER REFERENCES users(id),
  published BOOLEAN DEFAULT false
);`,
      output: `model Post {
  id        String  @id @default(uuid())
            @db.Uuid
  title     String  @db.VarChar(255)
  content   String?
  authorId  Int     @map("author_id")
  published Boolean @default(false)
  author    User    @relation(
              fields: [authorId],
              references: [id])

  @@map("posts")
}`,
    },
    {
      label: "Convert to Drizzle ORM",
      action: "Convert",
      input: `CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  user_id INTEGER NOT NULL
);`,
      output: `export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  total: decimal("total",
    { precision: 10, scale: 2 })
    .notNull(),
  status: varchar("status", { length: 20 })
    .default("pending"),
  userId: integer("user_id").notNull(),
});`,
    },
  ],
  "compression-tester": [
    {
      label: "Compare compression algorithms",
      action: "Test",
      input: `[JSON API response — 12.4 KB]`,
      output: `Brotli:  2.1 KB (83% savings) ★ best
Gzip:    2.8 KB (77% savings)
Deflate: 2.9 KB (77% savings)

Brotli is 25% smaller than Gzip
Compression time: 3ms / 2ms / 1ms`,
    },
    {
      label: "Test HTML compression",
      action: "Test",
      input: `[HTML page — 45.2 KB]`,
      output: `Brotli:  8.3 KB (82% savings) ★ best
Gzip:    9.7 KB (79% savings)
Deflate: 9.9 KB (78% savings)

All algorithms excellent for HTML
Recommended: Brotli for static assets`,
    },
    {
      label: "Test already-compressed data",
      action: "Test",
      input: `[PNG image data — 256 KB]`,
      output: `Brotli:  251 KB (2% savings)
Gzip:    253 KB (1% savings)
Deflate: 254 KB (1% savings)

⚠ Minimal compression achieved
Binary/media files compress poorly
Use image-specific optimization`,
    },
  ],
  "ts6-migration": [
    {
      label: "Check legacy tsconfig",
      action: "Check",
      input: `{
  "compilerOptions": {
    "target": "ES5",
    "module": "commonjs",
    "moduleResolution": "node",
    "outFile": "./bundle.js"
  }
}`,
      output: `Grade: D — 4 breaking changes

✗ target: "ES5" — removed in TS 6.0
  Fix: use "ES2020" or higher
✗ outFile — removed in TS 6.0
  Fix: use a bundler (esbuild, etc.)
✗ module: "commonjs" — deprecated
  Fix: use "NodeNext" or "ESNext"
⚠ moduleResolution: "node" — deprecated
  Fix: use "NodeNext" or "bundler"`,
    },
    {
      label: "Check modern tsconfig",
      action: "Check",
      input: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true
  }
}`,
      output: `Grade: A — Ready for TS 6.0

✓ target: "ES2022" — compatible
✓ module: "ESNext" — compatible
✓ moduleResolution: "bundler" — ok
✓ strict: true — now the default
No changes needed`,
    },
    {
      label: "Detect changed defaults",
      action: "Check",
      input: `{
  "compilerOptions": {
    "target": "ES2020",
    "strict": false,
    "esModuleInterop": false
  }
}`,
      output: `Grade: B — 2 changed defaults

⚠ strict: false — TS 6.0 defaults
  to true. You'll get new errors.
  Fix: enable gradually or keep false
⚠ esModuleInterop: false — now
  locked to true in TS 6.0
  Fix: remove this option
✓ target: "ES2020" — compatible`,
    },
  ],
  "eslint-to-biome": [
    {
      label: "Convert ESLint config to Biome",
      action: "Convert",
      input: `{
  "extends": ["eslint:recommended"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "eqeqeq": "error",
    "semi": ["error", "always"]
  }
}`,
      output: `{
  "linter": {
    "rules": {
      "correctness": {
        "noUnusedVariables": "error"
      },
      "suspicious": {
        "noConsole": "warn"
      },
      "style": {
        "useStrictEquality": "error"
      }
    }
  },
  "formatter": {
    "semicolons": "always"
  }
}
Mapped: 4/4 rules (100%)`,
    },
    {
      label: "Convert React + TypeScript config",
      action: "Convert",
      input: `{
  "extends": [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "react/jsx-no-target-blank": "error",
    "@typescript-eslint/no-explicit-any":
      "warn"
  }
}`,
      output: `{
  "linter": {
    "rules": {
      "security": {
        "noBlankTarget": "error"
      },
      "suspicious": {
        "noExplicitAny": "warn"
      }
    }
  }
}
Mapped: 2/2 rules
Note: Biome includes React and TS
rules by default — no plugins needed`,
    },
    {
      label: "Handle unmapped rules",
      action: "Convert",
      input: `{
  "rules": {
    "no-var": "error",
    "prefer-const": "error",
    "max-depth": ["error", 4],
    "complexity": ["error", 10]
  }
}`,
      output: `{
  "linter": {
    "rules": {
      "style": {
        "noVar": "error",
        "useConst": "error"
      },
      "complexity": {
        "noExcessiveNestedCallbacks":
          "error"
      }
    }
  }
}
Mapped: 3/4 rules
⚠ "complexity" has no direct Biome
  equivalent — use noExcessiveCognitive
  Complexity instead`,
    },
  ],
  "code-security-scanner": [
    {
      label: "Detect SQL injection",
      action: "Scan",
      input: `app.get("/users", (req, res) => {
  const query = "SELECT * FROM users " +
    "WHERE id = " + req.params.id;
  db.query(query);
});`,
      output: `✗ CRITICAL: SQL Injection (CWE-89)
Line 2: String concatenation in SQL query
  with unsanitized user input

Fix: Use parameterized queries
  db.query(
    "SELECT * FROM users WHERE id = $1",
    [req.params.id]
  );

Security Grade: F`,
    },
    {
      label: "Detect hardcoded secrets",
      action: "Scan",
      input: `const config = {
  apiKey: "sk-abc123def456",
  dbPassword: "admin123",
  jwtSecret: "mysecret",
};`,
      output: `✗ CRITICAL: Hardcoded API key (CWE-798)
  Line 2: apiKey looks like a secret
✗ HIGH: Hardcoded password (CWE-259)
  Line 3: dbPassword = "admin123"
✗ HIGH: Weak JWT secret (CWE-330)
  Line 4: jwtSecret too short

Fix: Use environment variables
  apiKey: process.env.API_KEY

Security Grade: D`,
    },
    {
      label: "Scan clean code",
      action: "Scan",
      input: `import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

app.post("/users", async (req, res) => {
  const data = UserSchema.parse(req.body);
  await db.users.create({ data });
  res.json({ success: true });
});`,
      output: `✓ No vulnerabilities found

✓ Input validation with Zod
✓ No string concatenation in queries
✓ No hardcoded secrets
✓ Parameterized database access

Security Grade: A`,
    },
  ],
  "code-complexity-analyzer": [
    {
      label: "Analyze simple function",
      action: "Analyze",
      input: `function add(a: number, b: number) {
  return a + b;
}`,
      output: `Function: add
  Cyclomatic: 1 (low)
  Cognitive: 0 (low)
  Nesting: 0
  Maintainability: A

Overall Grade: A
No issues found`,
    },
    {
      label: "Detect high complexity",
      action: "Analyze",
      input: `function processOrder(order) {
  if (order.type === "premium") {
    if (order.discount) {
      if (order.discount > 50) {
        if (order.items.length > 10) {
          // deeply nested logic...
        }
      }
    }
  } else if (order.type === "basic") {
    // more branching...
  }
}`,
      output: `Function: processOrder
  Cyclomatic: 8 (high) ⚠
  Cognitive: 15 (high) ⚠
  Nesting: 4 (very high) ✗
  Maintainability: D

Recommendations:
  → Extract nested conditions
  → Use early returns (guard clauses)
  → Break into smaller functions`,
    },
    {
      label: "Analyze multiple functions",
      action: "Analyze",
      input: `function validate(data) { ... }
function transform(data) { ... }
function save(data) { ... }`,
      output: `Function      Cycl  Cogn  Grade
validate       4     6     B
transform      2     3     A
save           3     4     B

Overall Grade: B
3 functions analyzed
Highest risk: validate (moderate)
No critical complexity found`,
    },
  ],
  "http-request-builder": [
    {
      label: "Build GET request",
      action: "Build",
      input: `Method: GET
URL: https://api.example.com/users
Headers:
  Authorization: Bearer token123
  Accept: application/json`,
      output: `curl -X GET \\
  'https://api.example.com/users' \\
  -H 'Authorization: Bearer token123' \\
  -H 'Accept: application/json'`,
    },
    {
      label: "Build POST with JSON body",
      action: "Build",
      input: `Method: POST
URL: https://api.example.com/users
Body: { "name": "Alice", "email": "a@b.com" }
Content-Type: application/json`,
      output: `curl -X POST \\
  'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"Alice",
       "email":"a@b.com"}'

# Python
requests.post(
  "https://api.example.com/users",
  json={"name": "Alice",
        "email": "a@b.com"})`,
    },
    {
      label: "Generate in multiple languages",
      action: "Build",
      input: `Method: GET
URL: /api/data
Languages: cURL, JS, Python, Go`,
      output: `# cURL
curl 'https://api.example.com/data'

# JavaScript (fetch)
const res = await fetch("/api/data");

# Python (requests)
r = requests.get("/api/data")

# Go (net/http)
resp, err := http.Get("/api/data")`,
    },
  ],
  "github-actions-validator": [
    {
      label: "Validate workflow YAML",
      action: "Validate",
      input: `name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test`,
      output: `✓ Valid GitHub Actions workflow
Triggers: push, pull_request
Jobs: 1 (test)
Steps: 4
Runner: ubuntu-latest
No issues found`,
    },
    {
      label: "Detect common mistakes",
      action: "Validate",
      input: `name: Deploy
on: push
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: npm install
      - run: npm run build
      - uses: actions/deploy@v1`,
      output: `⚠ 3 issues found:
✗ Missing actions/checkout step
  (code not available without it)
⚠ Use "npm ci" over "npm install"
  for reproducible CI builds
⚠ actions/deploy@v1 — not a real
  GitHub action. Check marketplace.
Fix: Add checkout as first step`,
    },
    {
      label: "Validate matrix strategy",
      action: "Validate",
      input: `jobs:
  test:
    strategy:
      matrix:
        node: [18, 20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}`,
      output: `✓ Valid matrix configuration
Combinations: 6 (3 × 2)
  node: 18, 20, 22
  os: ubuntu-latest, windows-latest
Expression syntax: valid
⚠ Missing actions/checkout step`,
    },
  ],
  "env-converter": [
    {
      label: "Convert .env to Docker Compose",
      action: "Convert",
      input: `DATABASE_URL=postgres://localhost/db
REDIS_URL=redis://localhost:6379
API_KEY=sk-abc123
PORT=3000`,
      output: `# docker-compose.yml
services:
  app:
    environment:
      - DATABASE_URL=postgres://localhost/db
      - REDIS_URL=redis://localhost:6379
      - API_KEY=sk-abc123
      - PORT=3000`,
    },
    {
      label: "Convert .env to K8s ConfigMap",
      action: "Convert",
      input: `APP_NAME=my-api
LOG_LEVEL=info
PORT=8080`,
      output: `apiVersion: v1
kind: ConfigMap
metadata:
  name: my-api-config
data:
  APP_NAME: "my-api"
  LOG_LEVEL: "info"
  PORT: "8080"`,
    },
    {
      label: "Convert .env to K8s Secret",
      action: "Convert",
      input: `DB_PASSWORD=supersecret
JWT_SECRET=my-jwt-key`,
      output: `apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DB_PASSWORD: c3VwZXJzZWNyZXQ=
  JWT_SECRET: bXktand0LWtleQ==

# Values are base64 encoded`,
    },
  ],
  "css-unit-converter": [
    {
      label: "Convert px to rem",
      action: "Convert",
      input: `Value: 24px
Base font size: 16px`,
      output: `24px = 1.5rem

Quick reference (base 16px):
  12px = 0.75rem
  14px = 0.875rem
  16px = 1rem
  24px = 1.5rem
  32px = 2rem`,
    },
    {
      label: "Convert rem to px",
      action: "Convert",
      input: `Value: 2.5rem
Base font size: 16px`,
      output: `2.5rem = 40px`,
    },
    {
      label: "Batch convert CSS values",
      action: "Convert",
      input: `.card {
  font-size: 14px;
  padding: 16px 24px;
  margin-bottom: 32px;
  border-radius: 8px;
}`,
      output: `.card {
  font-size: 0.875rem;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
}`,
    },
  ],
  "html-table-generator": [
    {
      label: "Generate basic table",
      action: "Generate",
      input: `Rows: 3, Columns: 3
Headers: Name, Email, Role
Data:
  Alice, alice@test.com, Admin
  Bob, bob@test.com, User`,
      output: `<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Alice</td>
      <td>alice@test.com</td>
      <td>Admin</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>bob@test.com</td>
      <td>User</td>
    </tr>
  </tbody>
</table>`,
    },
    {
      label: "Generate Tailwind-styled table",
      action: "Generate",
      input: `Style: Tailwind CSS
Striped: yes
Hover: yes`,
      output: `<table class="min-w-full
  divide-y divide-gray-200">
  <thead class="bg-gray-50">
    <tr>
      <th class="px-6 py-3 text-left
        text-xs font-medium
        text-gray-500 uppercase">
        Name
      </th>
    </tr>
  </thead>
  <tbody class="divide-y
    divide-gray-200">
    <tr class="hover:bg-gray-50
      even:bg-gray-25">
    </tr>
  </tbody>
</table>`,
    },
    {
      label: "Generate with caption",
      action: "Generate",
      input: `Caption: Monthly Sales
Columns: Month, Revenue
Data: Jan, $12k | Feb, $15k`,
      output: `<table>
  <caption>Monthly Sales</caption>
  <thead>
    <tr>
      <th>Month</th>
      <th>Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Jan</td><td>$12k</td></tr>
    <tr><td>Feb</td><td>$15k</td></tr>
  </tbody>
</table>`,
    },
  ],
  "aspect-ratio-calculator": [
    {
      label: "Calculate aspect ratio",
      action: "Calculate",
      input: `Width: 1920
Height: 1080`,
      output: `Aspect Ratio: 16:9
Decimal: 1.778
CSS: aspect-ratio: 16 / 9;

Common name: Full HD / Widescreen`,
    },
    {
      label: "Resize preserving ratio",
      action: "Resize",
      input: `Original: 3840 × 2160
New width: 1280`,
      output: `New dimensions: 1280 × 720

Ratio preserved: 16:9
Scale factor: 0.333x
CSS: aspect-ratio: 16 / 9;`,
    },
    {
      label: "Find ratio from preset",
      action: "Calculate",
      input: `Preset: Instagram Post
Size: 1080 × 1080`,
      output: `Aspect Ratio: 1:1 (Square)
Decimal: 1.000
CSS: aspect-ratio: 1 / 1;

Other 1:1 uses:
  Profile pictures, app icons,
  album covers, thumbnails`,
    },
  ],
  "clip-path": [
    {
      label: "Generate circle clip-path",
      action: "Generate",
      input: `Shape: Circle
Radius: 50%
Center: 50% 50%`,
      output: `clip-path: circle(50% at 50% 50%);
-webkit-clip-path:
  circle(50% at 50% 50%);`,
    },
    {
      label: "Generate triangle polygon",
      action: "Generate",
      input: `Shape: Polygon
Preset: Triangle`,
      output: `clip-path: polygon(
  50% 0%,
  0% 100%,
  100% 100%
);`,
    },
    {
      label: "Generate inset rectangle",
      action: "Generate",
      input: `Shape: Inset
Top: 10%
Right: 15%
Bottom: 10%
Left: 15%
Round: 8px`,
      output: `clip-path: inset(
  10% 15% 10% 15% round 8px
);`,
    },
  ],
  "css-filter": [
    {
      label: "Apply vintage photo effect",
      action: "Generate",
      input: `Preset: Vintage
Sepia: 60%
Contrast: 110%
Brightness: 90%`,
      output: `filter: sepia(60%) contrast(110%)
  brightness(90%);`,
    },
    {
      label: "Create grayscale with blur",
      action: "Generate",
      input: `Grayscale: 100%
Blur: 2px`,
      output: `filter: grayscale(100%) blur(2px);`,
    },
    {
      label: "Adjust image colors",
      action: "Generate",
      input: `Hue-rotate: 90deg
Saturate: 150%
Brightness: 105%`,
      output: `filter: hue-rotate(90deg)
  saturate(150%) brightness(105%);`,
    },
  ],
  "xpath-tester": [
    {
      label: "Select elements by path",
      action: "Test",
      input: `XPath: //book/title
XML:
<library>
  <book>
    <title>Clean Code</title>
  </book>
  <book>
    <title>Refactoring</title>
  </book>
</library>`,
      output: `Found 2 nodes:
1. <title>Clean Code</title>
2. <title>Refactoring</title>

Type: Element nodes`,
    },
    {
      label: "Filter with predicate",
      action: "Test",
      input: `XPath: //book[@year > 2020]/title
XML:
<library>
  <book year="2019">
    <title>Old Book</title>
  </book>
  <book year="2023">
    <title>New Book</title>
  </book>
</library>`,
      output: `Found 1 node:
1. <title>New Book</title>

Predicate: year > 2020
Matched: 1 of 2 books`,
    },
    {
      label: "Use XPath functions",
      action: "Test",
      input: `XPath: count(//item)
XML:
<list>
  <item>A</item>
  <item>B</item>
  <item>C</item>
</list>`,
      output: `Result: 3

Type: Number
Function: count()
Counted: 3 <item> elements`,
    },
  ],
  "sql-playground": [
    {
      label: "Run SELECT query",
      action: "Run",
      input: `CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT, age INTEGER
);
INSERT INTO users VALUES
  (1, 'Alice', 28),
  (2, 'Bob', 34),
  (3, 'Eve', 22);
SELECT * FROM users WHERE age > 25;`,
      output: `| id | name  | age |
|----|-------|-----|
| 1  | Alice | 28  |
| 2  | Bob   | 34  |

2 rows returned (1ms)`,
    },
    {
      label: "Test JOIN query",
      action: "Run",
      input: `SELECT u.name, COUNT(o.id) as orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.name
ORDER BY orders DESC;`,
      output: `| name  | orders |
|-------|--------|
| Alice | 5      |
| Bob   | 3      |
| Eve   | 0      |

3 rows returned (2ms)`,
    },
    {
      label: "Test window function",
      action: "Run",
      input: `SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC)
    as rank
FROM employees;`,
      output: `| name    | salary | rank |
|---------|--------|------|
| Alice   | 95000  | 1    |
| Charlie | 85000  | 2    |
| Bob     | 75000  | 3    |

3 rows returned (1ms)`,
    },
  ],
};
