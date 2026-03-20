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
};
