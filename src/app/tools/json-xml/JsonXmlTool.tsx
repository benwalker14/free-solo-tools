"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

type Mode = "json-to-xml" | "xml-to-json";

// --- JSON to XML converter ---

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeTagName(key: string): string {
  // XML tag names must start with letter or underscore, contain only letters, digits, hyphens, underscores, periods
  let name = key.replace(/[^a-zA-Z0-9_.-]/g, "_");
  if (!/^[a-zA-Z_]/.test(name)) {
    name = "_" + name;
  }
  return name || "item";
}

function jsonToXml(
  value: unknown,
  tagName: string,
  indent: number,
  level: number,
  useCdata: boolean,
  arrayItemName: string,
): string {
  const pad = " ".repeat(indent * level);
  const tag = sanitizeTagName(tagName);

  if (value === null || value === undefined) {
    return `${pad}<${tag} xsi:nil="true" />\n`;
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return `${pad}<${tag}>${String(value)}</${tag}>\n`;
  }

  if (typeof value === "string") {
    if (useCdata && (value.includes("<") || value.includes("&") || value.includes("]]>"))) {
      // Use CDATA for strings with special chars
      const escaped = value.replace(/]]>/g, "]]]]><![CDATA[>");
      return `${pad}<${tag}><![CDATA[${escaped}]]></${tag}>\n`;
    }
    return `${pad}<${tag}>${escapeXml(value)}</${tag}>\n`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${pad}<${tag} />\n`;
    }
    let xml = `${pad}<${tag}>\n`;
    const itemTag = sanitizeTagName(arrayItemName);
    for (const item of value) {
      xml += jsonToXml(item, itemTag, indent, level + 1, useCdata, arrayItemName);
    }
    xml += `${pad}</${tag}>\n`;
    return xml;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return `${pad}<${tag} />\n`;
    }
    let xml = `${pad}<${tag}>\n`;
    for (const [key, val] of entries) {
      xml += jsonToXml(val, key, indent, level + 1, useCdata, arrayItemName);
    }
    xml += `${pad}</${tag}>\n`;
    return xml;
  }

  return `${pad}<${tag}>${String(value)}</${tag}>\n`;
}

function convertJsonToXml(
  json: unknown,
  rootName: string,
  indentSize: number,
  addDeclaration: boolean,
  useCdata: boolean,
  arrayItemName: string,
): string {
  let xml = "";
  if (addDeclaration) {
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n';
  }

  if (Array.isArray(json)) {
    const root = sanitizeTagName(rootName);
    xml += `<${root}>\n`;
    const itemTag = sanitizeTagName(arrayItemName);
    for (const item of json) {
      xml += jsonToXml(item, itemTag, indentSize, 1, useCdata, arrayItemName);
    }
    xml += `</${root}>\n`;
  } else if (typeof json === "object" && json !== null) {
    xml += jsonToXml(json, rootName, indentSize, 0, useCdata, arrayItemName);
  } else {
    xml += jsonToXml(json, rootName, indentSize, 0, useCdata, arrayItemName);
  }

  return xml;
}

// --- XML to JSON converter ---

interface XmlNode {
  tag: string;
  attributes: Record<string, string>;
  children: XmlNode[];
  text: string;
}

function parseXml(xml: string): XmlNode {
  let pos = 0;

  function skipWhitespace() {
    while (pos < xml.length && /\s/.test(xml[pos])) pos++;
  }

  function parseText(): string {
    let text = "";
    while (pos < xml.length && xml[pos] !== "<") {
      text += xml[pos];
      pos++;
    }
    return text;
  }

  function parseCdata(): string {
    // pos is after <![CDATA[
    let text = "";
    while (pos < xml.length) {
      if (xml.substring(pos, pos + 3) === "]]>") {
        pos += 3;
        return text;
      }
      text += xml[pos];
      pos++;
    }
    return text;
  }

  function parseComment() {
    // pos is after <!--
    while (pos < xml.length) {
      if (xml.substring(pos, pos + 3) === "-->") {
        pos += 3;
        return;
      }
      pos++;
    }
  }

  function parseProcessingInstruction() {
    // pos is after <?
    while (pos < xml.length) {
      if (xml.substring(pos, pos + 2) === "?>") {
        pos += 2;
        return;
      }
      pos++;
    }
  }

  function parseAttributeValue(): string {
    const quote = xml[pos];
    if (quote !== '"' && quote !== "'") {
      throw new Error(`Expected quote at position ${pos}`);
    }
    pos++;
    let value = "";
    while (pos < xml.length && xml[pos] !== quote) {
      if (xml[pos] === "&") {
        const entityEnd = xml.indexOf(";", pos);
        if (entityEnd !== -1) {
          const entity = xml.substring(pos, entityEnd + 1);
          if (entity === "&amp;") value += "&";
          else if (entity === "&lt;") value += "<";
          else if (entity === "&gt;") value += ">";
          else if (entity === "&quot;") value += '"';
          else if (entity === "&apos;") value += "'";
          else if (entity.startsWith("&#x")) {
            value += String.fromCodePoint(parseInt(entity.slice(3, -1), 16));
          } else if (entity.startsWith("&#")) {
            value += String.fromCodePoint(parseInt(entity.slice(2, -1), 10));
          } else {
            value += entity;
          }
          pos = entityEnd + 1;
          continue;
        }
      }
      value += xml[pos];
      pos++;
    }
    pos++; // skip closing quote
    return value;
  }

  function parseElement(): XmlNode | null {
    skipWhitespace();
    if (pos >= xml.length || xml[pos] !== "<") return null;

    // Skip processing instructions, comments, DOCTYPE
    while (pos < xml.length && xml[pos] === "<") {
      if (xml.substring(pos, pos + 5) === "<?xml" || xml.substring(pos, pos + 2) === "<?") {
        pos += 2;
        parseProcessingInstruction();
        skipWhitespace();
        continue;
      }
      if (xml.substring(pos, pos + 4) === "<!--") {
        pos += 4;
        parseComment();
        skipWhitespace();
        continue;
      }
      if (xml.substring(pos, pos + 9) === "<!DOCTYPE" || xml.substring(pos, pos + 2) === "<!") {
        // Skip DOCTYPE or other declarations
        let depth = 1;
        pos += 2;
        while (pos < xml.length && depth > 0) {
          if (xml[pos] === "<") depth++;
          if (xml[pos] === ">") depth--;
          pos++;
        }
        skipWhitespace();
        continue;
      }
      break;
    }

    if (pos >= xml.length || xml[pos] !== "<") return null;

    pos++; // skip <
    skipWhitespace();

    // Parse tag name
    let tag = "";
    while (pos < xml.length && !/[\s/>]/.test(xml[pos])) {
      tag += xml[pos];
      pos++;
    }

    if (!tag) return null;

    // Parse attributes
    const attributes: Record<string, string> = {};
    skipWhitespace();
    while (pos < xml.length && xml[pos] !== ">" && xml[pos] !== "/") {
      let attrName = "";
      while (pos < xml.length && !/[\s=/>]/.test(xml[pos])) {
        attrName += xml[pos];
        pos++;
      }
      skipWhitespace();
      if (xml[pos] === "=") {
        pos++;
        skipWhitespace();
        attributes[attrName] = parseAttributeValue();
      } else if (attrName) {
        attributes[attrName] = "true";
      }
      skipWhitespace();
    }

    // Self-closing tag
    if (xml[pos] === "/") {
      pos++; // skip /
      if (xml[pos] === ">") pos++; // skip >
      return { tag, attributes, children: [], text: "" };
    }

    pos++; // skip >

    // Parse children and text content
    const children: XmlNode[] = [];
    let text = "";

    while (pos < xml.length) {
      if (xml[pos] === "<") {
        // Check for closing tag
        if (xml[pos + 1] === "/") {
          pos += 2;
          // Skip closing tag name and >
          while (pos < xml.length && xml[pos] !== ">") pos++;
          pos++; // skip >
          return { tag, attributes, children, text: text.trim() };
        }

        // Check for CDATA
        if (xml.substring(pos, pos + 9) === "<![CDATA[") {
          pos += 9;
          text += parseCdata();
          continue;
        }

        // Check for comment
        if (xml.substring(pos, pos + 4) === "<!--") {
          pos += 4;
          parseComment();
          continue;
        }

        // Child element
        const child = parseElement();
        if (child) {
          children.push(child);
        } else {
          pos++;
        }
      } else {
        const chunk = parseText();
        text += chunk;
      }
    }

    return { tag, attributes, children, text: text.trim() };
  }

  const root = parseElement();
  if (!root) {
    throw new Error("No root element found in XML");
  }
  return root;
}

function unescapeXmlText(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function xmlNodeToJson(
  node: XmlNode,
  preserveAttributes: boolean,
  attributePrefix: string,
  textKey: string,
): unknown {
  const hasAttributes = preserveAttributes && Object.keys(node.attributes).length > 0;
  const hasChildren = node.children.length > 0;
  const hasText = node.text.length > 0;

  // Leaf node with no attributes — return text or convert to primitive
  if (!hasChildren && !hasAttributes) {
    const val = unescapeXmlText(node.text);
    return coerceValue(val);
  }

  const obj: Record<string, unknown> = {};

  // Add attributes
  if (hasAttributes) {
    for (const [key, val] of Object.entries(node.attributes)) {
      // Skip xmlns and xsi namespace declarations
      if (key.startsWith("xmlns") || key.startsWith("xsi:")) continue;
      obj[`${attributePrefix}${key}`] = coerceValue(val);
    }
  }

  // Add text content
  if (hasText) {
    if (hasChildren || hasAttributes) {
      obj[textKey] = coerceValue(unescapeXmlText(node.text));
    } else {
      return coerceValue(unescapeXmlText(node.text));
    }
  }

  // Group children by tag name
  const childGroups: Record<string, unknown[]> = {};
  for (const child of node.children) {
    if (!childGroups[child.tag]) {
      childGroups[child.tag] = [];
    }
    childGroups[child.tag].push(
      xmlNodeToJson(child, preserveAttributes, attributePrefix, textKey),
    );
  }

  // Add children — arrays for repeated tags, single value for unique tags
  for (const [tag, values] of Object.entries(childGroups)) {
    obj[tag] = values.length === 1 ? values[0] : values;
  }

  return obj;
}

function coerceValue(str: string): string | number | boolean | null {
  if (str === "") return null;
  if (str === "true") return true;
  if (str === "false") return false;
  if (str === "null") return null;
  if (/^-?\d+$/.test(str) && str.length < 16) {
    const num = parseInt(str, 10);
    if (Number.isSafeInteger(num)) return num;
  }
  if (/^-?\d+\.\d+$/.test(str) && str.length < 20) {
    return parseFloat(str);
  }
  return str;
}

function convertXmlToJson(
  xml: string,
  indentSize: number,
  preserveAttributes: boolean,
  attributePrefix: string,
  textKey: string,
  unwrapRoot: boolean,
): string {
  const root = parseXml(xml.trim());
  const json = xmlNodeToJson(root, preserveAttributes, attributePrefix, textKey);

  if (unwrapRoot && typeof json === "object" && json !== null && !Array.isArray(json)) {
    return JSON.stringify(json, null, indentSize || undefined);
  }

  const wrapped: Record<string, unknown> = { [root.tag]: json };
  return JSON.stringify(wrapped, null, indentSize || undefined);
}

// --- Sample data ---

const SAMPLE_JSON = `{
  "bookstore": {
    "name": "Tech Books Online",
    "established": 2010,
    "books": [
      {
        "title": "Learning TypeScript",
        "author": "Josh Goldberg",
        "year": 2022,
        "isbn": "978-1098110338",
        "price": 49.99,
        "inStock": true,
        "tags": ["typescript", "programming", "web"]
      },
      {
        "title": "Designing Data-Intensive Applications",
        "author": "Martin Kleppmann",
        "year": 2017,
        "isbn": "978-1449373320",
        "price": 39.49,
        "inStock": true,
        "tags": ["databases", "distributed-systems", "architecture"]
      },
      {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "year": 2008,
        "isbn": "978-0132350884",
        "price": 34.99,
        "inStock": false,
        "tags": ["software-engineering", "best-practices"]
      }
    ]
  }
}`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <name>Tech Books Online</name>
  <established>2010</established>
  <books>
    <item>
      <title>Learning TypeScript</title>
      <author>Josh Goldberg</author>
      <year>2022</year>
      <isbn>978-1098110338</isbn>
      <price>49.99</price>
      <inStock>true</inStock>
      <tags>
        <item>typescript</item>
        <item>programming</item>
        <item>web</item>
      </tags>
    </item>
    <item>
      <title>Designing Data-Intensive Applications</title>
      <author>Martin Kleppmann</author>
      <year>2017</year>
      <isbn>978-1449373320</isbn>
      <price>39.49</price>
      <inStock>true</inStock>
      <tags>
        <item>databases</item>
        <item>distributed-systems</item>
        <item>architecture</item>
      </tags>
    </item>
    <item>
      <title>Clean Code</title>
      <author>Robert C. Martin</author>
      <year>2008</year>
      <isbn>978-0132350884</isbn>
      <price>34.99</price>
      <inStock>false</inStock>
      <tags>
        <item>software-engineering</item>
        <item>best-practices</item>
      </tags>
    </item>
  </books>
</bookstore>`;

const SAMPLE_JSON_API = `{
  "response": {
    "status": "success",
    "code": 200,
    "data": {
      "users": [
        {
          "id": 1,
          "name": "Alice Chen",
          "email": "alice@example.com",
          "role": "admin",
          "active": true
        },
        {
          "id": 2,
          "name": "Bob Smith",
          "email": "bob@example.com",
          "role": "editor",
          "active": true
        }
      ],
      "pagination": {
        "page": 1,
        "perPage": 10,
        "total": 42
      }
    }
  }
}`;

const SAMPLE_XML_ATTRS = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <product id="P001" category="electronics">
    <name>Wireless Mouse</name>
    <price currency="USD">29.99</price>
    <description><![CDATA[Ergonomic wireless mouse with <USB-C> receiver & Bluetooth]]></description>
    <specs>
      <spec name="battery">AA x 1</spec>
      <spec name="connectivity">2.4GHz + Bluetooth 5.0</spec>
      <spec name="weight">85g</spec>
    </specs>
    <inStock>true</inStock>
  </product>
  <product id="P002" category="accessories">
    <name>USB-C Hub</name>
    <price currency="USD">49.99</price>
    <description><![CDATA[7-in-1 USB-C hub: HDMI, 3x USB-A, SD & microSD, PD 100W]]></description>
    <specs>
      <spec name="ports">7</spec>
      <spec name="power">100W pass-through</spec>
    </specs>
    <inStock>true</inStock>
  </product>
</catalog>`;

const SAMPLES: { label: string; data: string; mode: Mode }[] = [
  { label: "Bookstore (JSON)", data: SAMPLE_JSON, mode: "json-to-xml" },
  { label: "API Response (JSON)", data: SAMPLE_JSON_API, mode: "json-to-xml" },
  { label: "Bookstore (XML)", data: SAMPLE_XML, mode: "xml-to-json" },
  { label: "Product Catalog with Attributes (XML)", data: SAMPLE_XML_ATTRS, mode: "xml-to-json" },
];

export default function JsonXmlTool() {
  const [mode, setMode] = useState<Mode>("json-to-xml");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // JSON → XML options
  const [rootName, setRootName] = useState("root");
  const [arrayItemName, setArrayItemName] = useState("item");
  const [indent, setIndent] = useState(2);
  const [addDeclaration, setAddDeclaration] = useState(true);
  const [useCdata, setUseCdata] = useState(false);

  // XML → JSON options
  const [preserveAttributes, setPreserveAttributes] = useState(true);
  const [attributePrefix, setAttributePrefix] = useState("@");
  const [textKey, setTextKey] = useState("#text");
  const [unwrapRoot, setUnwrapRoot] = useState(true);

  const { trackAction } = useToolAnalytics("json-xml");
  const { remaining, dailyLimit, isLimited, recordUsage } = useRateLimit("json-xml");

  const handleConvert = useCallback(() => {
    setError("");
    setOutput("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter some data to convert.");
      return;
    }

    if (isLimited) return;
    recordUsage();
    trackAction(mode);

    if (mode === "json-to-xml") {
      try {
        const parsed = JSON.parse(input);
        const result = convertJsonToXml(parsed, rootName, indent, addDeclaration, useCdata, arrayItemName);
        setOutput(result);
      } catch {
        setError("Invalid JSON. Check your syntax and try again.");
      }
    } else {
      try {
        const result = convertXmlToJson(input, indent, preserveAttributes, attributePrefix, textKey, unwrapRoot);
        setOutput(result);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Invalid XML. Check your syntax and try again.";
        setError(msg);
      }
    }
  }, [input, mode, rootName, arrayItemName, indent, addDeclaration, useCdata, preserveAttributes, attributePrefix, textKey, unwrapRoot, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const ext = mode === "json-to-xml" ? "xml" : "json";
    const mimeType = mode === "json-to-xml" ? "application/xml" : "application/json";
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLoadSample(sample: (typeof SAMPLES)[number]) {
    setMode(sample.mode);
    setInput(sample.data);
    setOutput("");
    setError("");
  }

  function handleSwapMode() {
    const newMode: Mode = mode === "json-to-xml" ? "xml-to-json" : "json-to-xml";
    setMode(newMode);
    if (output) {
      setInput(output);
      setOutput("");
    }
    setError("");
    setCopied(false);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        JSON ↔ XML Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Convert between JSON and XML formats. Handles nested objects, arrays,
        attributes, CDATA sections, and XML declarations.
      </p>

      <RateLimitBanner remaining={remaining} dailyLimit={dailyLimit} isLimited={isLimited} />

      {/* Mode toggle + core options */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            onClick={() => { if (mode !== "json-to-xml") handleSwapMode(); }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              mode === "json-to-xml"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            JSON → XML
          </button>
          <button
            onClick={() => { if (mode !== "xml-to-json") handleSwapMode(); }}
            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 dark:border-gray-600 ${
              mode === "xml-to-json"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            }`}
          >
            XML → JSON
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Indent:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            {mode === "xml-to-json" && <option value={0}>Minified</option>}
          </select>
        </div>
      </div>

      {/* Mode-specific options */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {mode === "json-to-xml" ? (
          <>
            <div className="flex items-center gap-1.5">
              <label className="text-gray-600 dark:text-gray-400">Root:</label>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value || "root")}
                className="w-24 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                placeholder="root"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label className="text-gray-600 dark:text-gray-400">Array item:</label>
              <input
                type="text"
                value={arrayItemName}
                onChange={(e) => setArrayItemName(e.target.value || "item")}
                className="w-24 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                placeholder="item"
              />
            </div>
            <label className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={addDeclaration}
                onChange={(e) => setAddDeclaration(e.target.checked)}
                className="rounded"
              />
              XML declaration
            </label>
            <label className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={useCdata}
                onChange={(e) => setUseCdata(e.target.checked)}
                className="rounded"
              />
              CDATA for special chars
            </label>
          </>
        ) : (
          <>
            <label className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveAttributes}
                onChange={(e) => setPreserveAttributes(e.target.checked)}
                className="rounded"
              />
              Preserve attributes
            </label>
            {preserveAttributes && (
              <div className="flex items-center gap-1.5">
                <label className="text-gray-600 dark:text-gray-400">Attr prefix:</label>
                <input
                  type="text"
                  value={attributePrefix}
                  onChange={(e) => setAttributePrefix(e.target.value)}
                  className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                  placeholder="@"
                />
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <label className="text-gray-600 dark:text-gray-400">Text key:</label>
              <input
                type="text"
                value={textKey}
                onChange={(e) => setTextKey(e.target.value || "#text")}
                className="w-20 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                placeholder="#text"
              />
            </div>
            <label className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={unwrapRoot}
                onChange={(e) => setUnwrapRoot(e.target.checked)}
                className="rounded"
              />
              Unwrap root element
            </label>
          </>
        )}
      </div>

      {/* Sample data */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => handleLoadSample(s)}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === "json-to-xml" ? "JSON Input" : "XML Input"}
          </label>
          {input && (
            <button
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === "json-to-xml"
              ? '{\n  "key": "value",\n  "items": [1, 2, 3]\n}'
              : '<root>\n  <key>value</key>\n  <items>\n    <item>1</item>\n  </items>\n</root>'
          }
          rows={14}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          spellCheck={false}
        />
      </div>

      {/* Convert button */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={handleConvert}
          disabled={isLimited || !input.trim()}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
        >
          Convert{" "}
          <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-medium sm:inline-block">
            Ctrl+Enter
          </kbd>
        </button>
        {output && (
          <button
            onClick={handleSwapMode}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            ↔ Swap &amp; convert back
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Output */}
      {output && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {mode === "json-to-xml" ? "XML Output" : "JSON Output"}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                Download .{mode === "json-to-xml" ? "xml" : "json"}
              </button>
              <button
                onClick={handleCopy}
                className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 font-mono text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
            {output}
          </pre>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About JSON ↔ XML Conversion
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>JSON</strong> (JavaScript Object Notation) — lightweight data format with objects, arrays, strings, numbers, booleans, and null.
          </li>
          <li>
            <strong>XML</strong> (Extensible Markup Language) — hierarchical markup format with elements, attributes, namespaces, and CDATA sections.
          </li>
          <li>
            <strong>JSON → XML:</strong> Objects become elements, arrays wrap items in a configurable tag (default: &quot;item&quot;), primitives become text content. Root element name is configurable.
          </li>
          <li>
            <strong>XML → JSON:</strong> Elements become keys, repeated sibling elements become arrays, attributes use a configurable prefix (default: &quot;@&quot;), text content uses a configurable key (default: &quot;#text&quot;).
          </li>
          <li>
            Swap button carries output to input for round-trip conversion.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
