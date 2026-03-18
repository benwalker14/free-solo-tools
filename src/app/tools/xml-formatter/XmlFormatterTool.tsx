"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

interface XmlToken {
  type:
    | "xmlDecl"
    | "comment"
    | "cdata"
    | "processingInstruction"
    | "openTag"
    | "closeTag"
    | "selfCloseTag"
    | "text";
  raw: string;
  tagName?: string;
  attributes?: string;
  content?: string;
}

function tokenizeXml(xml: string): XmlToken[] {
  const tokens: XmlToken[] = [];
  let i = 0;

  while (i < xml.length) {
    if (xml[i] === "<") {
      // XML declaration <?xml ... ?>
      if (xml.startsWith("<?xml", i)) {
        const end = xml.indexOf("?>", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: xml.slice(i) });
          break;
        }
        tokens.push({ type: "xmlDecl", raw: xml.slice(i, end + 2) });
        i = end + 2;
        continue;
      }

      // Processing instruction <?name ... ?>
      if (xml[i + 1] === "?") {
        const end = xml.indexOf("?>", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: xml.slice(i) });
          break;
        }
        tokens.push({ type: "processingInstruction", raw: xml.slice(i, end + 2) });
        i = end + 2;
        continue;
      }

      // Comment <!-- ... -->
      if (xml.startsWith("<!--", i)) {
        const end = xml.indexOf("-->", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: xml.slice(i) });
          break;
        }
        const content = xml.slice(i + 4, end);
        tokens.push({ type: "comment", raw: xml.slice(i, end + 3), content });
        i = end + 3;
        continue;
      }

      // CDATA <![CDATA[ ... ]]>
      if (xml.startsWith("<![CDATA[", i)) {
        const end = xml.indexOf("]]>", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: xml.slice(i) });
          break;
        }
        const content = xml.slice(i + 9, end);
        tokens.push({ type: "cdata", raw: xml.slice(i, end + 3), content });
        i = end + 3;
        continue;
      }

      // DOCTYPE <!DOCTYPE ...>
      if (xml.startsWith("<!DOCTYPE", i) || xml.startsWith("<!doctype", i)) {
        // Handle nested brackets in DOCTYPE
        let depth = 1;
        let j = i + 1;
        while (j < xml.length && depth > 0) {
          if (xml[j] === "<") depth++;
          if (xml[j] === ">") depth--;
          j++;
        }
        tokens.push({ type: "xmlDecl", raw: xml.slice(i, j) });
        i = j;
        continue;
      }

      // Close tag </name>
      if (xml[i + 1] === "/") {
        const end = xml.indexOf(">", i);
        if (end === -1) {
          tokens.push({ type: "text", raw: xml.slice(i) });
          break;
        }
        const inner = xml.slice(i + 2, end).trim();
        tokens.push({ type: "closeTag", raw: xml.slice(i, end + 1), tagName: inner });
        i = end + 1;
        continue;
      }

      // Open tag or self-closing tag
      const end = xml.indexOf(">", i);
      if (end === -1) {
        tokens.push({ type: "text", raw: xml.slice(i) });
        break;
      }
      const tagContent = xml.slice(i + 1, end);
      const selfClosing = tagContent.endsWith("/");
      const cleanContent = selfClosing ? tagContent.slice(0, -1) : tagContent;

      // Extract tag name and attributes
      const nameMatch = cleanContent.match(/^(\S+)([\s\S]*)$/);
      if (nameMatch) {
        const tagName = nameMatch[1];
        const attributes = nameMatch[2].trim();
        tokens.push({
          type: selfClosing ? "selfCloseTag" : "openTag",
          raw: xml.slice(i, end + 1),
          tagName,
          attributes: attributes || undefined,
        });
      } else {
        tokens.push({ type: "text", raw: xml.slice(i, end + 1) });
      }
      i = end + 1;
      continue;
    }

    // Text content
    let text = "";
    while (i < xml.length && xml[i] !== "<") {
      text += xml[i];
      i++;
    }
    if (text) {
      tokens.push({ type: "text", raw: text, content: text });
    }
  }

  return tokens;
}

function formatXml(xml: string, indent: string): string {
  const tokens = tokenizeXml(xml);
  const lines: string[] = [];
  let depth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    switch (token.type) {
      case "xmlDecl":
      case "processingInstruction":
        lines.push(indent.repeat(depth) + token.raw.trim());
        break;

      case "comment":
        lines.push(indent.repeat(depth) + token.raw.trim());
        break;

      case "cdata":
        lines.push(indent.repeat(depth) + token.raw.trim());
        break;

      case "openTag": {
        const attrs = token.attributes ? " " + token.attributes : "";
        lines.push(indent.repeat(depth) + `<${token.tagName}${attrs}>`);

        // Check if next token is text and the one after is the matching close tag
        // If so, keep them on one line: <tag>text</tag>
        if (
          i + 2 < tokens.length &&
          tokens[i + 1].type === "text" &&
          tokens[i + 2].type === "closeTag" &&
          tokens[i + 2].tagName === token.tagName
        ) {
          const textContent = (tokens[i + 1].content || tokens[i + 1].raw).trim();
          if (textContent && !textContent.includes("\n")) {
            // Rewrite the last line to include text and closing tag inline
            lines[lines.length - 1] =
              indent.repeat(depth) +
              `<${token.tagName}${attrs}>${textContent}</${token.tagName}>`;
            i += 2; // Skip text and close tag
            break;
          }
        }

        depth++;
        break;
      }

      case "closeTag":
        depth = Math.max(0, depth - 1);
        lines.push(indent.repeat(depth) + `</${token.tagName}>`);
        break;

      case "selfCloseTag": {
        const attrs = token.attributes ? " " + token.attributes : "";
        lines.push(indent.repeat(depth) + `<${token.tagName}${attrs} />`);
        break;
      }

      case "text": {
        const trimmed = (token.content || token.raw).trim();
        if (trimmed) {
          lines.push(indent.repeat(depth) + trimmed);
        }
        break;
      }
    }
  }

  return lines.join("\n");
}

function minifyXml(xml: string): string {
  const tokens = tokenizeXml(xml);
  let result = "";

  for (const token of tokens) {
    if (token.type === "text") {
      const trimmed = (token.content || token.raw).trim();
      if (trimmed) {
        result += trimmed;
      }
    } else if (token.type === "comment") {
      // Strip comments in minified output
      continue;
    } else {
      result += token.raw.trim();
    }
  }

  return result;
}

function validateXml(xml: string): { valid: boolean; error?: string } {
  if (!xml.trim()) {
    return { valid: false, error: "Empty input" };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const errorNode = doc.querySelector("parsererror");

  if (errorNode) {
    // Extract meaningful error message
    let errorText = errorNode.textContent || "XML parsing error";
    // Clean up browser-specific error formatting
    errorText = errorText.replace(/This page contains the following errors:/, "").trim();
    errorText = errorText.replace(/Below is a rendering of the page up to the first error./, "").trim();
    return { valid: false, error: errorText };
  }

  return { valid: true };
}

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101" category="fiction">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102" category="fiction">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies and an evil sorceress.</description>
  </book>
  <!-- More books can be added here -->
  <metadata>
    <total_books>2</total_books>
    <last_updated>2024-01-15T10:30:00Z</last_updated>
    <source><![CDATA[https://example.com/books?format=xml&limit=100]]></source>
  </metadata>
</catalog>`;

export default function XmlFormatterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
  } | null>(null);
  const [indentSize, setIndentSize] = useState<"2" | "4" | "tab">("2");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("xml-formatter");
  const { trackAction } = useToolAnalytics("xml-formatter");

  const getIndent = () => {
    if (indentSize === "tab") return "\t";
    return " ".repeat(Number(indentSize));
  };

  const handleFormat = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("format");
    setError("");
    setOutput("");
    setValidation(null);
    try {
      if (!input.trim()) {
        setError("Please enter XML to format.");
        return;
      }
      const result = validateXml(input);
      setValidation(result);
      if (!result.valid) {
        setError(result.error || "Invalid XML");
        return;
      }
      const formatted = formatXml(input, getIndent());
      setOutput(formatted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error formatting XML");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLimited, recordUsage, trackAction, indentSize]);

  useKeyboardShortcut("Enter", handleFormat);

  function handleMinify() {
    if (isLimited) return;
    recordUsage();
    trackAction("minify");
    setError("");
    setOutput("");
    setValidation(null);
    try {
      if (!input.trim()) {
        setError("Please enter XML to minify.");
        return;
      }
      const result = validateXml(input);
      setValidation(result);
      if (!result.valid) {
        setError(result.error || "Invalid XML");
        return;
      }
      const minified = minifyXml(input);
      setOutput(minified);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error minifying XML");
    }
  }

  function handleValidate() {
    if (isLimited) return;
    recordUsage();
    trackAction("validate");
    setError("");
    setOutput("");
    try {
      if (!input.trim()) {
        setError("Please enter XML to validate.");
        return;
      }
      const result = validateXml(input);
      setValidation(result);
      if (!result.valid) {
        setError(result.error || "Invalid XML");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error validating XML");
    }
  }

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  }

  function handleLoadSample() {
    setInput(SAMPLE_XML);
    setOutput("");
    setError("");
    setValidation(null);
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
        XML Formatter &amp; Validator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Format, beautify, validate, and minify XML documents instantly. Supports
        comments, CDATA, processing instructions, and namespaces.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your XML here..."
        rows={10}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 dark:text-gray-400 font-medium">
            Indent:
          </label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {(["2", "4", "tab"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  indentSize === size
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {size === "tab" ? "Tab" : `${size} spaces`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleFormat}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Format{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handleMinify}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Minify
        </button>
        <button
          onClick={handleValidate}
          disabled={isLimited}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Validate
        </button>
        <button
          onClick={handleLoadSample}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Load sample
        </button>
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Validation result */}
      {validation && !error && (
        <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-400">
          Valid XML document
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {output && (
        <div className="relative mt-4 rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
          <button
            onClick={handleCopy}
            className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Copy
          </button>
          <textarea
            readOnly
            value={output}
            rows={Math.min(20, output.split("\n").length + 1)}
            spellCheck={false}
            className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
      )}

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About XML Formatting
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            This tool formats XML documents for readability by adding proper
            indentation and placing each element on its own line. It validates
            your XML using the browser&apos;s built-in DOMParser before formatting.
          </p>
          <p>
            <strong>Validation:</strong> Checks for well-formedness — properly
            nested tags, matching open/close tags, valid attribute syntax, and
            correct use of special characters. Reports the first error found.
          </p>
          <p>
            <strong>Minify:</strong> Removes all unnecessary whitespace between
            tags and strips comments, producing compact single-line XML. Useful
            for reducing payload size in APIs and configuration files.
          </p>
          <p>
            <strong>Supported features:</strong> XML declarations ({`<?xml?>`}),
            processing instructions, comments ({`<!-- -->`}), CDATA sections
            ({`<![CDATA[]]>`}), DOCTYPE declarations, namespaced elements, and
            self-closing tags.
          </p>
        </div>
      </details>
    </div>
  );
}
