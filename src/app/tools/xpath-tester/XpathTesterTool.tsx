"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="programming">
    <title lang="en">The Pragmatic Programmer</title>
    <author>David Thomas</author>
    <year>2019</year>
    <price>49.99</price>
  </book>
  <book category="programming">
    <title lang="en">Clean Code</title>
    <author>Robert C. Martin</author>
    <year>2008</year>
    <price>39.99</price>
  </book>
  <book category="design">
    <title lang="en">Design Patterns</title>
    <author>Gang of Four</author>
    <year>1994</year>
    <price>54.99</price>
  </book>
  <book category="algorithms">
    <title lang="en">Introduction to Algorithms</title>
    <author>Thomas Cormen</author>
    <year>2009</year>
    <price>79.99</price>
  </book>
</bookstore>`;

const EXAMPLE_QUERIES = [
  { path: "//book/title", description: "All book titles" },
  { path: "//book[@category='programming']", description: "Programming books" },
  { path: "//book[price<50]/title", description: "Titles under $50" },
  { path: "//title/@lang", description: "All lang attributes" },
  { path: "//book[1]", description: "First book" },
  { path: "//book[last()]", description: "Last book" },
  { path: "count(//book)", description: "Count books" },
  { path: "//book[contains(author,'Thomas')]", description: "Authors with 'Thomas'" },
];

interface XPathResult {
  type: "nodes" | "string" | "number" | "boolean";
  value: string;
  matchCount: number;
}

function serializeNode(node: Node): string {
  const serializer = new XMLSerializer();
  const raw = serializer.serializeToString(node);
  return raw;
}

function prettyPrintXml(xml: string): string {
  let formatted = "";
  let indent = 0;
  const parts = xml.replace(/(>)(<)/g, "$1\n$2").split("\n");

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }

    formatted += "  ".repeat(indent) + trimmed + "\n";

    if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("</") &&
      !trimmed.startsWith("<?") &&
      !trimmed.endsWith("/>") &&
      !trimmed.includes("</")
    ) {
      indent++;
    }
  }

  return formatted.trimEnd();
}

function evaluateXPath(xmlString: string, xpath: string): XPathResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, "application/xml");

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    throw new Error(
      "Invalid XML: " + (parseError.textContent?.split("\n")[0] || "Parse error"),
    );
  }

  // Try to evaluate — browser returns one of several result types
  const result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);

  switch (result.resultType) {
    case XPathResult.NUMBER_TYPE:
      return {
        type: "number",
        value: String(result.numberValue),
        matchCount: 1,
      };
    case XPathResult.STRING_TYPE:
      return {
        type: "string",
        value: result.stringValue,
        matchCount: 1,
      };
    case XPathResult.BOOLEAN_TYPE:
      return {
        type: "boolean",
        value: String(result.booleanValue),
        matchCount: 1,
      };
    default: {
      // Node set — iterate and serialize
      const nodes: string[] = [];
      let node = result.iterateNext();
      while (node) {
        if (node.nodeType === Node.ATTRIBUTE_NODE) {
          const attr = node as Attr;
          nodes.push(`${attr.name}="${attr.value}"`);
        } else if (node.nodeType === Node.TEXT_NODE) {
          nodes.push(node.textContent || "");
        } else {
          nodes.push(prettyPrintXml(serializeNode(node)));
        }
        node = result.iterateNext();
      }
      return {
        type: "nodes",
        value: nodes.join("\n\n"),
        matchCount: nodes.length,
      };
    }
  }
}

const XPATH_REFERENCE = [
  { expression: "/", desc: "Root element" },
  { expression: "//element", desc: "All matching elements anywhere" },
  { expression: "./child", desc: "Direct child of context" },
  { expression: "@attr", desc: "Attribute value" },
  { expression: "[1]", desc: "First element (1-indexed)" },
  { expression: "[last()]", desc: "Last element" },
  { expression: "[position()<3]", desc: "First two elements" },
  { expression: "[@attr='val']", desc: "Filter by attribute" },
  { expression: "[contains(., 'text')]", desc: "Contains text" },
  { expression: "[starts-with(@id, 'x')]", desc: "Starts with" },
  { expression: "text()", desc: "Text content" },
  { expression: "node()", desc: "Any node" },
  { expression: "count(//el)", desc: "Count elements" },
  { expression: "sum(//el)", desc: "Sum of numeric values" },
  { expression: "string-length(//el)", desc: "String length" },
  { expression: "ancestor::el", desc: "Ancestor axis" },
  { expression: "descendant::el", desc: "Descendant axis" },
  { expression: "following-sibling::el", desc: "Following siblings" },
  { expression: "parent::el", desc: "Parent axis" },
  { expression: "el1 | el2", desc: "Union of two node sets" },
];

export default function XpathTesterTool() {
  const [xmlInput, setXmlInput] = useState("");
  const [xpathInput, setXpathInput] = useState("");
  const [output, setOutput] = useState("");
  const [resultType, setResultType] = useState<string>("");
  const [matchCount, setMatchCount] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("xpath-tester");
  const { trackAction } = useToolAnalytics("xpath-tester");

  const handleEvaluate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("evaluate");
    setError("");
    setOutput("");
    setResultType("");
    setMatchCount(null);
    setCopied(false);

    if (!xmlInput.trim()) {
      setError("Please enter XML data.");
      return;
    }
    if (!xpathInput.trim()) {
      setError("Please enter an XPath expression.");
      return;
    }

    try {
      const result = evaluateXPath(xmlInput, xpathInput);
      setResultType(result.type);
      setMatchCount(result.matchCount);
      if (result.type === "nodes" && result.matchCount === 0) {
        setOutput("No matches found.");
      } else {
        setOutput(result.value);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid XPath expression");
    }
  }, [xmlInput, xpathInput, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleEvaluate);

  function handleCopy() {
    if (output && output !== "No matches found.") {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  function handleLoadSample() {
    setXmlInput(SAMPLE_XML);
    setXpathInput("//book/title");
    setOutput("");
    setError("");
    setResultType("");
    setMatchCount(null);
    setCopied(false);
  }

  function handleExampleClick(path: string) {
    setXpathInput(path);
    setOutput("");
    setError("");
    setResultType("");
    setMatchCount(null);
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
        XPath Tester
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Test XPath expressions against XML data with real-time evaluation.
        Extract elements, filter by attributes, and navigate XML document
        structures.
      </p>

      {/* XML Input */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        XML Data
      </label>
      <textarea
        value={xmlInput}
        onChange={(e) => setXmlInput(e.target.value)}
        placeholder="Paste your XML here..."
        rows={12}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* XPath Input */}
      <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        XPath Expression
      </label>
      <input
        type="text"
        value={xpathInput}
        onChange={(e) => setXpathInput(e.target.value)}
        placeholder="//book[@category='programming']/title"
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-3 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Example queries */}
      {xmlInput.trim() && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAMPLE_QUERIES.map((ex) => (
            <button
              key={ex.path}
              onClick={() => handleExampleClick(ex.path)}
              title={ex.path}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-indigo-950 dark:hover:border-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              {ex.description}
            </button>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleEvaluate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Evaluate{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
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

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Results */}
      {output && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-3">
            {matchCount !== null && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {matchCount === 0
                  ? "No matches"
                  : `${matchCount} match${matchCount === 1 ? "" : "es"} found`}
              </span>
            )}
            {resultType && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {resultType}
              </span>
            )}
          </div>
          <div className="relative rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
            {output !== "No matches found." && (
              <button
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
            <textarea
              readOnly
              value={output}
              rows={Math.min(20, output.split("\n").length + 1)}
              spellCheck={false}
              className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* XPath Reference */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          XPath Reference
        </summary>
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 pr-4 text-left font-medium text-gray-700 dark:text-gray-300">
                  Expression
                </th>
                <th className="py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {XPATH_REFERENCE.map((ref) => (
                <tr
                  key={ref.expression}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="py-1.5 pr-4">
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                      {ref.expression}
                    </code>
                  </td>
                  <td className="py-1.5 text-gray-600 dark:text-gray-400">
                    {ref.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* About section */}
      <details className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About XPath
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            XPath (XML Path Language) is a query language for selecting nodes
            from XML documents. It uses path expressions to navigate through
            elements, attributes, and text in an XML tree structure.
          </p>
          <div>
            <strong>Key concepts:</strong>
            <ul className="mt-1 ml-4 list-disc space-y-1">
              <li>
                <strong>Nodes</strong> — elements, attributes, text, comments,
                and the document itself
              </li>
              <li>
                <strong>Axes</strong> — define the direction of navigation
                (child, parent, ancestor, descendant, sibling)
              </li>
              <li>
                <strong>Predicates</strong> — filter nodes with conditions
                inside square brackets
              </li>
              <li>
                <strong>Functions</strong> — built-in string, number, and node
                functions (contains, count, sum, etc.)
              </li>
            </ul>
          </div>
          <p>
            XPath is used in XSLT, XQuery, web scraping (Selenium, Puppeteer),
            configuration parsing, and XML data extraction. This tool uses your
            browser&apos;s built-in XPath 1.0 engine — no data is sent over the
            network.
          </p>
        </div>
      </details>
    </div>
  );
}
