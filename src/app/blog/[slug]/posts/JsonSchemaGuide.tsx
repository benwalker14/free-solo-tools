import Link from "next/link";

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-indigo-600 dark:bg-gray-800 dark:text-indigo-400">
      {children}
    </code>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      {title && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto bg-gray-50 p-4 text-sm leading-relaxed dark:bg-gray-900">
        <code className="font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function JsonSchemaGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        JSON Schema is a vocabulary for describing and validating the structure
        of JSON data. If you&apos;ve ever wished you could enforce types on a
        JSON API response the way TypeScript enforces types in code, JSON Schema
        is the answer. This guide covers the core concepts you need to start
        validating JSON today.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Is JSON Schema?
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A JSON Schema is itself a JSON document that describes what valid data
        looks like. It defines types, required fields, value constraints,
        patterns, and relationships. Validators use the schema to check whether
        a given JSON document conforms.
      </p>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Common use cases include:
      </p>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Validating API request and response bodies</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Documenting data formats (OpenAPI uses JSON Schema)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Generating forms and UI from data models</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Configuration file validation (e.g., VS Code settings, ESLint config)</span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Your First Schema
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here&apos;s a simple schema for a user object:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["name", "email"]
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        This schema says: the data must be an object with <Code>name</Code>{" "}
        (string, required), <Code>email</Code> (string in email format,
        required), and <Code>age</Code> (non-negative integer, optional).
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Types
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        JSON Schema supports seven primitive types:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Type
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>string</Code></td>
              <td className="py-3">Text values</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>number</Code></td>
              <td className="py-3">Any numeric value (integer or float)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>integer</Code></td>
              <td className="py-3">Whole numbers only</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>boolean</Code></td>
              <td className="py-3"><Code>true</Code> or <Code>false</Code></td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>object</Code></td>
              <td className="py-3">Key-value pairs</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>array</Code></td>
              <td className="py-3">Ordered list of values</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>null</Code></td>
              <td className="py-3">The null value</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        String Validation
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Strings support length constraints, patterns, and built-in formats:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "type": "string",
  "minLength": 1,
  "maxLength": 255,
  "pattern": "^[a-zA-Z0-9_]+$"
}

// Built-in formats (not all validators enforce these):
{ "type": "string", "format": "email" }
{ "type": "string", "format": "uri" }
{ "type": "string", "format": "date-time" }
{ "type": "string", "format": "uuid" }
{ "type": "string", "format": "ipv4" }
{ "type": "string", "format": "ipv6" }`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Number Validation
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Numbers can be constrained to ranges and multiples:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "type": "number",
  "minimum": 0,
  "maximum": 100,
  "exclusiveMinimum": 0,
  "multipleOf": 0.01
}

// Integer with enum (only these values are valid)
{
  "type": "integer",
  "enum": [1, 2, 3, 5, 8, 13]
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Objects and Required Fields
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Objects are defined by their properties. Use <Code>required</Code> to
        list fields that must be present, and{" "}
        <Code>additionalProperties</Code> to control whether extra fields are
        allowed:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "role": {
      "type": "string",
      "enum": ["admin", "user", "viewer"]
    }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        Setting <Code>additionalProperties: false</Code> makes the schema
        strict &mdash; any key not listed in <Code>properties</Code> will fail
        validation. This catches typos and prevents unexpected data from
        slipping through.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Arrays
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Arrays are validated by the schema of their items, plus optional length
        and uniqueness constraints:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "type": "array",
  "items": { "type": "string" },
  "minItems": 1,
  "maxItems": 10,
  "uniqueItems": true
}

// Array of objects
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "integer" },
      "tag": { "type": "string" }
    },
    "required": ["id", "tag"]
  }
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Reuse with $ref and $defs
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Avoid repeating yourself by defining reusable schemas with{" "}
        <Code>$defs</Code> and referencing them with <Code>$ref</Code>:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "$defs": {
    "address": {
      "type": "object",
      "properties": {
        "street": { "type": "string" },
        "city": { "type": "string" },
        "zip": { "type": "string", "pattern": "^\\\\d{5}$" }
      },
      "required": ["street", "city", "zip"]
    }
  },
  "type": "object",
  "properties": {
    "billing": { "$ref": "#/$defs/address" },
    "shipping": { "$ref": "#/$defs/address" }
  }
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>$ref</Code> pointer <Code>#/$defs/address</Code> means
        &ldquo;look in the current document, under <Code>$defs</Code>, at the{" "}
        <Code>address</Code> key.&rdquo; You can also reference schemas in
        external files.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Composition: oneOf, anyOf, allOf
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Combine schemas with logical operators for more complex validation:
      </p>
      <CodeBlock title="JSON Schema">
        {`// Value must match exactly one schema
{
  "oneOf": [
    { "type": "string" },
    { "type": "integer" }
  ]
}

// Value must match at least one schema
{
  "anyOf": [
    { "type": "string", "minLength": 1 },
    { "type": "null" }
  ]
}

// Value must match ALL schemas (intersection)
{
  "allOf": [
    { "$ref": "#/$defs/baseUser" },
    {
      "properties": {
        "role": { "const": "admin" }
      }
    }
  ]
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Conditional Validation
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use <Code>if</Code>/<Code>then</Code>/<Code>else</Code> for fields that
        depend on other fields:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "type": "object",
  "properties": {
    "type": { "enum": ["email", "sms"] },
    "value": { "type": "string" }
  },
  "if": {
    "properties": { "type": { "const": "email" } }
  },
  "then": {
    "properties": { "value": { "format": "email" } }
  },
  "else": {
    "properties": { "value": { "pattern": "^\\\\+?[0-9]{10,15}$" } }
  }
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        If <Code>type</Code> is <Code>&quot;email&quot;</Code>, the{" "}
        <Code>value</Code> must be a valid email. Otherwise, it must look like
        a phone number.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Real-World Example: API Response
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here&apos;s a complete schema for a paginated API response:
      </p>
      <CodeBlock title="JSON Schema">
        {`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string", "minLength": 1 },
          "email": { "type": "string", "format": "email" },
          "createdAt": { "type": "string", "format": "date-time" }
        },
        "required": ["id", "name", "email", "createdAt"],
        "additionalProperties": false
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "page": { "type": "integer", "minimum": 1 },
        "perPage": { "type": "integer", "minimum": 1, "maximum": 100 },
        "total": { "type": "integer", "minimum": 0 }
      },
      "required": ["page", "perPage", "total"]
    }
  },
  "required": ["data", "meta"]
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Validate Your Schemas
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/json-schema"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JSON Schema Validator
        </Link>{" "}
        to test your schemas against sample data instantly. For generating
        TypeScript-style runtime validators, try the{" "}
        <Link
          href="/tools/zod-schema"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Zod Schema Generator
        </Link>
        . Both tools run entirely in your browser with no signup required.
      </p>
    </>
  );
}
