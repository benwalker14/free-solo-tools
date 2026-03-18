import ToolCard from "@/components/ToolCard";

const tools = [
  {
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON data instantly",
    href: "/tools/json-formatter",
    icon: "{ }",
  },
  {
    title: "Base64 Codec",
    description: "Encode and decode Base64 strings with Unicode support",
    href: "/tools/base64",
    icon: "B64",
  },
  {
    title: "Hash Generator",
    description: "Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes",
    href: "/tools/hash-generator",
    icon: "#",
  },
  {
    title: "UUID Generator",
    description: "Generate random UUID v4 identifiers in bulk",
    href: "/tools/uuid-generator",
    icon: "ID",
  },
  {
    title: "Color Converter",
    description: "Convert colors between HEX, RGB, and HSL formats",
    href: "/tools/color-converter",
    icon: "CLR",
  },
  {
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens instantly",
    href: "/tools/jwt-decoder",
    icon: "JWT",
  },
  {
    title: "Regex Tester",
    description: "Test regular expressions with real-time match highlighting",
    href: "/tools/regex-tester",
    icon: ".*",
  },
  {
    title: "URL Parser",
    description: "Parse URLs into protocol, host, path, and query params",
    href: "/tools/url-parser",
    icon: "URL",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Free Online Tools That Just Work
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Fast, clean, and private. No signup required. No annoying popups.
          Just&nbsp;tools.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  );
}
