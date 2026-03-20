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
};
