import ToolGrid from "@/components/ToolGrid";

const BASE_URL = "https://free-solo-tools.vercel.app";

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
  {
    title: "Markdown Preview",
    description: "Write and preview Markdown with live rendering",
    href: "/tools/markdown-preview",
    icon: "MD",
  },
  {
    title: "Diff Checker",
    description: "Compare two texts and see differences highlighted",
    href: "/tools/diff-checker",
    icon: "+-",
  },
  {
    title: "Epoch Converter",
    description: "Convert Unix timestamps to dates and back",
    href: "/tools/epoch-converter",
    icon: "EP",
  },
  {
    title: "Password Generator",
    description: "Generate strong, secure random passwords",
    href: "/tools/password-generator",
    icon: "PW",
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and layouts",
    href: "/tools/lorem-ipsum",
    icon: "Li",
  },
  {
    title: "Case Converter",
    description: "Convert text between camelCase, snake_case, kebab-case, and more",
    href: "/tools/case-converter",
    icon: "Aa",
  },
  {
    title: "Number Base Converter",
    description: "Convert numbers between binary, octal, decimal, and hex",
    href: "/tools/number-base-converter",
    icon: "0x",
  },
];

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FreeSolo Tools",
  url: BASE_URL,
  description:
    "Fast, clean, free online tools for developers. No signup required.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online Developer Tools",
  numberOfItems: tools.length,
  itemListElement: tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.title,
    url: `${BASE_URL}${tool.href}`,
  })),
};

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Free Online Tools That Just Work
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Fast, clean, and private. No signup required. No annoying popups.
          Just&nbsp;tools.
        </p>
      </div>
      <ToolGrid tools={tools} />
    </div>
  );
}
