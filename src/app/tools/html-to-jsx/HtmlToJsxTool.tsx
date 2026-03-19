"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

// ---------------------------------------------------------------------------
// HTML attribute → JSX attribute mapping
// ---------------------------------------------------------------------------

const ATTR_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  enctype: "encType",
  crossorigin: "crossOrigin",
  accesskey: "accessKey",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  formaction: "formAction",
  formenctype: "formEncType",
  formmethod: "formMethod",
  formnovalidate: "formNoValidate",
  formtarget: "formTarget",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  inputmode: "inputMode",
  novalidate: "noValidate",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
  usemap: "useMap",
  datetime: "dateTime",
  classid: "classID",
  charset: "charSet",
  allowfullscreen: "allowFullScreen",
  contenteditable: "contentEditable",
  contextmenu: "contextMenu",
  spellcheck: "spellCheck",
  "http-equiv": "httpEquiv",
  "accept-charset": "acceptCharset",
  "clip-path": "clipPath",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-variant": "fontVariant",
  "font-weight": "fontWeight",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "stroke-width": "strokeWidth",
  "text-anchor": "textAnchor",
  "text-decoration": "textDecoration",
  "text-rendering": "textRendering",
  "dominant-baseline": "dominantBaseline",
  "alignment-baseline": "alignmentBaseline",
  "baseline-shift": "baselineShift",
  "pointer-events": "pointerEvents",
  "shape-rendering": "shapeRendering",
  "image-rendering": "imageRendering",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  "xlink:href": "xlinkHref",
  "xlink:title": "xlinkTitle",
  "xlink:show": "xlinkShow",
  "xlink:type": "xlinkType",
  "xlink:role": "xlinkRole",
  "xlink:arcrole": "xlinkArcrole",
  "xlink:actuate": "xlinkActuate",
  "xml:lang": "xmlLang",
  "xml:space": "xmlSpace",
};

// Void/self-closing elements in HTML
const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

// ---------------------------------------------------------------------------
// Inline style parser
// ---------------------------------------------------------------------------

function cssPropertyToJs(prop: string): string {
  if (prop.startsWith("-")) {
    const withoutDash = prop.slice(1);
    return withoutDash
      .replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/^([a-z])/, (_, c) => c.toUpperCase());
  }
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseInlineStyle(styleStr: string): string {
  const declarations = styleStr.split(";").filter((s) => s.trim());
  const parts: string[] = [];

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const prop = decl.slice(0, colonIdx).trim();
    const value = decl.slice(colonIdx + 1).trim();
    if (!prop || !value) continue;

    const jsProp = cssPropertyToJs(prop);
    // Pure numeric values (no units) stay as numbers
    const isNumeric = /^-?\d+(\.\d+)?$/.test(value);
    parts.push(isNumeric ? `${jsProp}: ${value}` : `${jsProp}: "${value}"`);
  }

  return `{{ ${parts.join(", ")} }}`;
}

// ---------------------------------------------------------------------------
// Regex escaping
// ---------------------------------------------------------------------------

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---------------------------------------------------------------------------
// Core conversion
// ---------------------------------------------------------------------------

interface ConvertOptions {
  createComponent: boolean;
  componentName: string;
  useFragment: boolean;
}

function convertHtmlToJsx(html: string, options: ConvertOptions): string {
  if (!html.trim()) return "";
  let jsx = html;

  // Convert HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, (_match, content) => `{/*${content}*/}`);

  // Convert inline styles: style="..." → style={{ ... }}
  jsx = jsx.replace(
    /\bstyle="([^"]*)"/g,
    (_match, styleContent: string) => `style={${parseInlineStyle(styleContent)}}`,
  );
  jsx = jsx.replace(
    /\bstyle='([^']*)'/g,
    (_match, styleContent: string) => `style={${parseInlineStyle(styleContent)}}`,
  );

  // Convert on* event handlers: onclick="..." → onClick={() => { ... }}
  jsx = jsx.replace(
    /\bon([a-z]+)="([^"]*)"/gi,
    (_match, event: string, handler: string) => {
      const jsxEvent = `on${event.charAt(0).toUpperCase()}${event.slice(1).toLowerCase()}`;
      return `${jsxEvent}={() => { ${handler} }}`;
    },
  );

  // Map HTML attributes to JSX attributes (sorted by length desc so longer matches first)
  const sortedAttrs = Object.entries(ATTR_MAP).sort((a, b) => b[0].length - a[0].length);
  for (const [htmlAttr, jsxAttr] of sortedAttrs) {
    // Match attribute with double quotes
    const dqRegex = new RegExp(`\\b${escapeRegex(htmlAttr)}=("(?:[^"]*)")`, "gi");
    jsx = jsx.replace(dqRegex, `${jsxAttr}=$1`);
    // Match attribute with single quotes
    const sqRegex = new RegExp(`\\b${escapeRegex(htmlAttr)}='([^']*)'`, "gi");
    jsx = jsx.replace(sqRegex, (_, val) => `${jsxAttr}="${val}"`);
    // Match standalone boolean attribute (no value)
    const boolRegex = new RegExp(
      `(<[a-zA-Z][^>]*\\s)${escapeRegex(htmlAttr)}((?=\\s|>|\\/>))`,
      "gi",
    );
    jsx = jsx.replace(boolRegex, `$1${jsxAttr}$2`);
  }

  // Self-close void elements: <br> → <br />, <img ...> → <img ... />
  for (const tag of VOID_ELEMENTS) {
    const regex = new RegExp(`<(${tag})(\\s[^>]*?)?\\/?>`, "gi");
    jsx = jsx.replace(regex, (_match, tagName: string, attrs: string | undefined) => {
      const attrStr = attrs ? attrs.replace(/\s*\/$/, "") : "";
      return `<${tagName}${attrStr} />`;
    });
  }

  // Wrap in component if requested
  if (options.createComponent) {
    const name = options.componentName || "MyComponent";
    const trimmed = jsx.trim();
    const needsWrapper = options.useFragment && hasMultipleRoots(trimmed);
    if (needsWrapper) {
      jsx = `export default function ${name}() {\n  return (\n    <>\n${indentBlock(trimmed, 6)}\n    </>\n  );\n}`;
    } else {
      jsx = `export default function ${name}() {\n  return (\n${indentBlock(trimmed, 4)}\n  );\n}`;
    }
  }

  return jsx;
}

function hasMultipleRoots(html: string): boolean {
  const trimmed = html.trim();
  let depth = 0;
  let roots = 0;
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g;
  let match;
  while ((match = tagRegex.exec(trimmed))) {
    const full = match[0];
    if (full.startsWith("</")) {
      depth--;
    } else if (full.endsWith("/>")) {
      if (depth === 0) roots++;
    } else {
      if (depth === 0) roots++;
      depth++;
    }
    if (roots > 1) return true;
  }
  return false;
}

function indentBlock(str: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return str
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

// ---------------------------------------------------------------------------
// Samples
// ---------------------------------------------------------------------------

const SAMPLES: { label: string; html: string }[] = [
  {
    label: "Basic div",
    html: `<div class="container">
  <h1 class="title">Hello World</h1>
  <p class="text-gray-500">Welcome to my app.</p>
</div>`,
  },
  {
    label: "Form",
    html: `<form action="/submit" method="post">
  <label for="email">Email</label>
  <input type="email" id="email" class="input" readonly tabindex="1" autofocus>
  <label for="password">Password</label>
  <input type="password" id="password" class="input" maxlength="128">
  <button type="submit" class="btn" disabled>Sign In</button>
</form>`,
  },
  {
    label: "Inline styles",
    html: `<div style="background-color: #1a1a2e; color: white; padding: 20px; border-radius: 8px;">
  <h2 style="font-size: 24px; margin-bottom: 12px;">Styled Card</h2>
  <p style="line-height: 1.6; opacity: 0.8;">Inline styles get converted to objects.</p>
</div>`,
  },
  {
    label: "Images & media",
    html: `<div class="gallery">
  <img src="/photo.jpg" alt="A photo" class="rounded">
  <br>
  <video controls autoplay muted>
    <source src="/video.mp4" type="video/mp4">
  </video>
  <hr>
</div>`,
  },
  {
    label: "SVG",
    html: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon">
  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0.5"/>
  <path d="M2 17l10 5 10-5" stroke-width="2" stroke-linecap="round"/>
</svg>`,
  },
  {
    label: "Table",
    html: `<table cellpadding="8" cellspacing="0" class="data-table">
  <thead>
    <tr>
      <th colspan="2">Name</th>
      <th rowspan="2">Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="cell">Alice</td>
      <td class="cell">Smith</td>
      <td>95</td>
    </tr>
  </tbody>
</table>`,
  },
  {
    label: "Comments",
    html: `<div class="page">
  <!-- Navigation -->
  <nav class="navbar">
    <a href="/" class="logo">Home</a>
    <!-- TODO: Add dropdown menu -->
  </nav>
  <!-- Main content area -->
  <main class="content">
    <p>Hello world</p>
  </main>
</div>`,
  },
];

// ---------------------------------------------------------------------------
// Change tracker
// ---------------------------------------------------------------------------

interface Change {
  from: string;
  to: string;
  count: number;
}

function getChanges(html: string): Change[] {
  const changes: Change[] = [];

  const classMatches = html.match(/\bclass="/g);
  if (classMatches) changes.push({ from: "class", to: "className", count: classMatches.length });

  const forMatches = html.match(/\bfor="/g);
  if (forMatches) changes.push({ from: "for", to: "htmlFor", count: forMatches.length });

  const styleMatches = html.match(/\bstyle="[^"]+"/g);
  if (styleMatches) changes.push({ from: 'style="..."', to: "style={{ }}", count: styleMatches.length });

  const commentMatches = html.match(/<!--[\s\S]*?-->/g);
  if (commentMatches) changes.push({ from: "<!-- -->", to: "{/* */}", count: commentMatches.length });

  let selfCloseCount = 0;
  for (const tag of VOID_ELEMENTS) {
    const regex = new RegExp(`<${tag}(\\s[^>]*)?(?<!/)>`, "gi");
    const matches = html.match(regex);
    if (matches) selfCloseCount += matches.length;
  }
  if (selfCloseCount > 0) changes.push({ from: "<tag>", to: "<tag />", count: selfCloseCount });

  const eventMatches = html.match(/\bon[a-z]+="/gi);
  if (eventMatches) changes.push({ from: 'onclick="..."', to: "onClick={()=>{}}", count: eventMatches.length });

  for (const [htmlAttr, jsxAttr] of Object.entries(ATTR_MAP)) {
    if (htmlAttr === "class" || htmlAttr === "for") continue;
    const regex = new RegExp(`\\b${escapeRegex(htmlAttr)}[=\\s>]`, "gi");
    const matches = html.match(regex);
    if (matches) changes.push({ from: htmlAttr, to: jsxAttr, count: matches.length });
  }

  return changes;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HtmlToJsxTool() {
  useToolAnalytics("html-to-jsx");

  const [html, setHtml] = useState(SAMPLES[0].html);
  const [createComponent, setCreateComponent] = useState(false);
  const [componentName, setComponentName] = useState("MyComponent");
  const [useFragment, setUseFragment] = useState(true);
  const [copied, setCopied] = useState(false);

  const options: ConvertOptions = useMemo(
    () => ({ createComponent, componentName, useFragment }),
    [createComponent, componentName, useFragment],
  );

  const jsx = useMemo(() => convertHtmlToJsx(html, options), [html, options]);
  const changes = useMemo(() => getChanges(html), [html]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(jsx).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [jsx]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          HTML to JSX Converter
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Convert HTML to valid JSX — transforms attributes, inline styles, comments, void elements, event handlers, and SVG attributes.
        </p>
      </div>

      {/* Samples */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Examples
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLES.map((s) => (
            <button
              key={s.label}
              onClick={() => setHtml(s.html)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                html === s.html
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={createComponent}
            onChange={() => setCreateComponent((v) => !v)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          Wrap in component
        </label>
        {createComponent && (
          <>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value.replace(/[^a-zA-Z0-9_$]/g, ""))}
              placeholder="ComponentName"
              className="w-40 rounded border border-gray-200 bg-white px-2 py-1 text-sm font-mono text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={useFragment}
                onChange={() => setUseFragment((v) => !v)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Fragment for multiple roots
            </label>
          </>
        )}
      </div>

      {/* Editor panes */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* HTML Input */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              HTML Input
            </h2>
            <button
              onClick={() => setHtml("")}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear
            </button>
          </div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Paste your HTML here..."
            spellCheck={false}
            className="h-80 w-full resize-y rounded-lg border border-gray-200 bg-white p-3 font-mono text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder-gray-500"
          />
        </div>

        {/* JSX Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              JSX Output
            </h2>
            <button
              onClick={copy}
              disabled={!jsx.trim()}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="h-80 w-full overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            {jsx || "// Paste HTML on the left to see JSX output here"}
          </pre>
        </div>
      </div>

      {/* Changes summary */}
      {changes.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Changes Made
          </h2>
          <div className="flex flex-wrap gap-2">
            {changes.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <code className="text-red-600 line-through dark:text-red-400">{c.from}</code>
                <span className="text-gray-400">&rarr;</span>
                <code className="text-green-600 dark:text-green-400">{c.to}</code>
                {c.count > 1 && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    &times;{c.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          HTML &rarr; JSX Quick Reference
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 pr-4 font-semibold text-gray-600 dark:text-gray-400">HTML</th>
                <th className="pb-2 pr-4 font-semibold text-gray-600 dark:text-gray-400">JSX</th>
                <th className="pb-2 font-semibold text-gray-600 dark:text-gray-400">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[
                { html: 'class="..."', jsx: 'className="..."', why: '"class" is a reserved word in JavaScript' },
                { html: 'for="..."', jsx: 'htmlFor="..."', why: '"for" is a reserved word in JavaScript' },
                { html: 'style="color: red"', jsx: "style={{ color: 'red' }}", why: "JSX styles are objects, not strings" },
                { html: "<!-- comment -->", jsx: "{/* comment */}", why: "JSX uses JS comment syntax" },
                { html: "<br>", jsx: "<br />", why: "JSX requires self-closing void tags" },
                { html: "<img ...>", jsx: "<img ... />", why: "All void elements must self-close" },
                { html: 'tabindex="0"', jsx: 'tabIndex="0"', why: "JSX uses camelCase attributes" },
                { html: 'onclick="..."', jsx: "onClick={() => {}}", why: "Event handlers are camelCase functions" },
                { html: 'colspan="2"', jsx: 'colSpan="2"', why: "Multi-word attributes are camelCase" },
                { html: 'stroke-width="2"', jsx: 'strokeWidth="2"', why: "SVG attributes use camelCase in JSX" },
              ].map((row) => (
                <tr key={row.html}>
                  <td className="py-1.5 pr-4 font-mono text-red-600 dark:text-red-400">{row.html}</td>
                  <td className="py-1.5 pr-4 font-mono text-green-600 dark:text-green-400">{row.jsx}</td>
                  <td className="py-1.5 text-gray-500 dark:text-gray-400">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SEO sub-page links */}
      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Related Guides
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/tools/html-to-jsx/html-vs-jsx-differences", label: "HTML vs JSX Differences" },
            { href: "/tools/html-to-jsx/react-jsx-cheatsheet", label: "React JSX Cheatsheet" },
            { href: "/tools/html-to-jsx/jsx-style-objects", label: "JSX Style Objects Guide" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-blue-300 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-blue-700 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
