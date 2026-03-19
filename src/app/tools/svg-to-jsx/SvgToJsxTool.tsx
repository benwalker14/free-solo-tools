"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── SVG attribute → JSX attribute mapping ──

const SVG_ATTR_MAP: Record<string, string> = {
  // Core HTML attributes
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  // SVG presentation attributes (kebab-case → camelCase)
  "accent-height": "accentHeight",
  "alignment-baseline": "alignmentBaseline",
  "arabic-form": "arabicForm",
  "baseline-shift": "baselineShift",
  "cap-height": "capHeight",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "color-interpolation": "colorInterpolation",
  "color-interpolation-filters": "colorInterpolationFilters",
  "color-profile": "colorProfile",
  "dominant-baseline": "dominantBaseline",
  "enable-background": "enableBackground",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "flood-color": "floodColor",
  "flood-opacity": "floodOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-size-adjust": "fontSizeAdjust",
  "font-stretch": "fontStretch",
  "font-style": "fontStyle",
  "font-variant": "fontVariant",
  "font-weight": "fontWeight",
  "glyph-name": "glyphName",
  "glyph-orientation-horizontal": "glyphOrientationHorizontal",
  "glyph-orientation-vertical": "glyphOrientationVertical",
  "horiz-adv-x": "horizAdvX",
  "horiz-origin-x": "horizOriginX",
  "image-rendering": "imageRendering",
  "letter-spacing": "letterSpacing",
  "lighting-color": "lightingColor",
  "marker-end": "markerEnd",
  "marker-mid": "markerMid",
  "marker-start": "markerStart",
  "overline-position": "overlinePosition",
  "overline-thickness": "overlineThickness",
  "paint-order": "paintOrder",
  "panose-1": "panose1",
  "pointer-events": "pointerEvents",
  "rendering-intent": "renderingIntent",
  "shape-rendering": "shapeRendering",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "strikethrough-position": "strikethroughPosition",
  "strikethrough-thickness": "strikethroughThickness",
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
  "underline-position": "underlinePosition",
  "underline-thickness": "underlineThickness",
  "unicode-bidi": "unicodeBidi",
  "unicode-range": "unicodeRange",
  "units-per-em": "unitsPerEm",
  "v-alphabetic": "vAlphabetic",
  "v-hanging": "vHanging",
  "v-ideographic": "vIdeographic",
  "v-mathematical": "vMathematical",
  "vert-adv-y": "vertAdvY",
  "vert-origin-x": "vertOriginX",
  "vert-origin-y": "vertOriginY",
  "word-spacing": "wordSpacing",
  "writing-mode": "writingMode",
  "x-height": "xHeight",
  // xlink namespace
  "xlink:actuate": "xlinkActuate",
  "xlink:arcrole": "xlinkArcrole",
  "xlink:href": "xlinkHref",
  "xlink:role": "xlinkRole",
  "xlink:show": "xlinkShow",
  "xlink:title": "xlinkTitle",
  "xlink:type": "xlinkType",
  // xml namespace
  "xml:base": "xmlBase",
  "xml:lang": "xmlLang",
  "xml:space": "xmlSpace",
  // xmlns
  "xmlns:xlink": "xmlnsXlink",
};

// Attributes to remove (namespace declarations, comments-related)
const ATTRS_TO_REMOVE = new Set([
  "xmlns:xlink",
  "xml:space",
  "xmlns:svg",
]);

type OutputMode = "jsx" | "component" | "typescript";

interface ConvertOptions {
  outputMode: OutputMode;
  componentName: string;
  addProps: boolean;
  removeDimensions: boolean;
  removeXmlns: boolean;
  addRef: boolean;
  exportDefault: boolean;
  memo: boolean;
}

interface ConvertResult {
  output: string;
  changes: string[];
  attributeCount: number;
  elementCount: number;
}

// ── Convert SVG to JSX ──

function convertSvgToJsx(svgInput: string, options: ConvertOptions): ConvertResult {
  const changes: string[] = [];
  let attributeCount = 0;
  let elementCount = 0;

  // Trim input
  let svg = svgInput.trim();

  if (!svg) return { output: "", changes: [], attributeCount: 0, elementCount: 0 };

  // Remove XML declaration
  if (svg.startsWith("<?xml")) {
    svg = svg.replace(/<\?xml[^?]*\?>\s*/g, "");
    changes.push("Removed XML declaration");
  }

  // Remove comments
  const commentMatch = svg.match(/<!--[\s\S]*?-->/g);
  if (commentMatch) {
    svg = svg.replace(/<!--[\s\S]*?-->/g, "");
    changes.push(`Removed ${commentMatch.length} comment(s)`);
  }

  // Remove DOCTYPE
  if (svg.includes("<!DOCTYPE")) {
    svg = svg.replace(/<!DOCTYPE[^>]*>/g, "");
    changes.push("Removed DOCTYPE");
  }

  // Count elements
  const elemMatches = svg.match(/<[a-zA-Z][^/>]*\/?>/g);
  elementCount = elemMatches ? elemMatches.length : 0;

  // Convert style attribute values: style="color: red" → style={{ color: "red" }}
  svg = svg.replace(/style="([^"]*)"/g, (_match, styleStr: string) => {
    const props = styleStr
      .split(";")
      .filter((s: string) => s.trim())
      .map((s: string) => {
        const [prop, ...valParts] = s.split(":");
        const key = prop
          .trim()
          .replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        const val = valParts.join(":").trim();
        // Numbers stay as numbers, everything else is a string
        const numVal = Number(val);
        if (!isNaN(numVal) && val !== "") {
          return `${key}: ${numVal}`;
        }
        return `${key}: "${val}"`;
      });
    changes.push("Converted inline style to object");
    return `style={{${props.join(", ")}}}`;
  });

  // Replace attributes
  svg = svg.replace(/<([a-zA-Z][a-zA-Z0-9]*)([\s\S]*?)(\/?>)/g, (match, tag, attrsStr, close) => {
    let attrs = attrsStr as string;

    // Convert each attribute
    attrs = attrs.replace(/\s([a-zA-Z][a-zA-Z0-9:_-]*)(?:=("[^"]*"|'[^']*'|{[^}]*}))?/g, (_attrMatch: string, name: string, value: string | undefined) => {
      // Remove xmlns:xlink etc.
      if (ATTRS_TO_REMOVE.has(name)) {
        changes.push(`Removed ${name}`);
        return "";
      }

      // Remove xmlns on non-root (options)
      if (name === "xmlns" && options.removeXmlns) {
        return "";
      }

      // Remove width/height if removeDimensions and tag is svg
      if (options.removeDimensions && tag === "svg" && (name === "width" || name === "height")) {
        changes.push(`Removed ${name} from <svg>`);
        return "";
      }

      // Map attribute name
      const jsxName = SVG_ATTR_MAP[name] || name;
      if (jsxName !== name) {
        attributeCount++;
      }

      if (value === undefined) {
        return ` ${jsxName}`;
      }
      return ` ${jsxName}=${value}`;
    });

    return `<${tag}${attrs}${close}`;
  });

  // Build output based on mode
  let output = svg.trim();

  if (options.outputMode === "jsx") {
    // Just return the JSX markup
    return { output, changes, attributeCount, elementCount };
  }

  // Component mode
  const isTS = options.outputMode === "typescript";
  const cn = options.componentName || "SvgIcon";
  const imp: string[] = ["React"];
  if (options.memo) imp.push("memo");
  if (options.addRef) imp.push("forwardRef");

  let code = "";

  if (isTS) {
    code += `import React${imp.length > 1 ? `, { ${imp.slice(1).join(", ")} }` : ""} from "react";\n\n`;

    if (options.addProps) {
      code += `interface ${cn}Props extends React.SVGProps<SVGSVGElement> {\n  title?: string;\n}\n\n`;
    }
  } else {
    code += `import React${imp.length > 1 ? `, { ${imp.slice(1).join(", ")} }` : ""} from "react";\n\n`;
  }

  const propsType = isTS
    ? options.addProps
      ? `${cn}Props`
      : "React.SVGProps<SVGSVGElement>"
    : "";

  // Inject props spread into <svg> tag
  if (options.addProps) {
    output = output.replace(
      /(<svg)([\s\S]*?)(>)/,
      (_match, open, attrs, close) => {
        return `${open}${attrs} {...props}${close}`;
      },
    );
    // Add title support
    if (options.addProps) {
      output = output.replace(
        /(<svg[\s\S]*?>)/,
        "$1\n      {title && <title>{title}</title>}",
      );
    }
  }

  if (options.addRef) {
    const typeAnnotation = isTS ? `<SVGSVGElement, ${propsType || "React.SVGProps<SVGSVGElement>"}>` : "";
    const params = options.addProps
      ? isTS
        ? `({ title, ...props }: ${propsType}, ref: React.Ref<SVGSVGElement>)`
        : `({ title, ...props }, ref)`
      : isTS
        ? `(props: ${propsType}, ref: React.Ref<SVGSVGElement>)`
        : `(props, ref)`;

    // Inject ref into <svg> tag
    output = output.replace(
      /(<svg)/,
      "$1 ref={ref}",
    );

    code += `const ${cn} = forwardRef${typeAnnotation}(${params} => (\n  ${output}\n));\n\n`;
    code += `${cn}.displayName = "${cn}";\n\n`;
  } else {
    const params = options.addProps
      ? isTS
        ? `({ title, ...props }: ${propsType})`
        : `({ title, ...props })`
      : isTS
        ? `(props: ${propsType})`
        : `(props)`;

    if (options.addProps) {
      code += `const ${cn} = ${params} => (\n  ${output}\n);\n\n`;
    } else {
      code += `const ${cn} = () => (\n  ${output}\n);\n\n`;
    }
  }

  if (options.memo) {
    code += `const Memoized${cn} = memo(${cn});\n\n`;
    code += options.exportDefault
      ? `export default Memoized${cn};\n`
      : `export { Memoized${cn} as ${cn} };\n`;
  } else {
    code += options.exportDefault
      ? `export default ${cn};\n`
      : `export { ${cn} };\n`;
  }

  return { output: code, changes, attributeCount, elementCount };
}

// ── Samples ──

const SAMPLES: { label: string; svg: string }[] = [
  {
    label: "Simple Icon",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <line x1="12" y1="8" x2="12" y2="16"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>`,
  },
  {
    label: "Logo",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" width="100" height="100">
  <!-- Logo Shape -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
  <rect x="10" y="10" width="80" height="80" rx="16" fill="url(#grad)"/>
  <text x="50" y="62" text-anchor="middle" fill="white" font-size="40" font-weight="bold" font-family="sans-serif">D</text>
</svg>`,
  },
  {
    label: "Arrow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right">
  <line x1="5" y1="12" x2="19" y2="12"/>
  <polyline points="12 5 19 12 12 19"/>
</svg>`,
  },
  {
    label: "With Styles",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8; transition: all 0.3s"/>
</svg>`,
  },
  {
    label: "Complex",
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256" width="256" height="256" xml:space="preserve">
  <!-- Generated by editor -->
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M128 20C68.4 20 20 68.4 20 128s48.4 108 108 108 108-48.4 108-108S187.6 20 128 20z" fill="#4F46E5"/>
    <path d="M128 60c-37.6 0-68 30.4-68 68s30.4 68 68 68 68-30.4 68-68-30.4-68-68-68z" fill="white" fill-opacity="0.3"/>
    <circle cx="128" cy="128" r="28" fill="white"/>
  </g>
  <text x="128" y="200" text-anchor="middle" font-family="Arial" font-size="16" fill="#4F46E5" font-weight="600">Icon</text>
</svg>`,
  },
];

// ── Main Component ──

export default function SvgToJsxTool() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<ConvertOptions>({
    outputMode: "jsx",
    componentName: "SvgIcon",
    addProps: true,
    removeDimensions: false,
    removeXmlns: false,
    addRef: false,
    exportDefault: true,
    memo: false,
  });
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("svg-to-jsx");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("svg-to-jsx");

  const result = useMemo<ConvertResult | null>(() => {
    if (!input.trim()) return null;
    try {
      return convertSvgToJsx(input, options);
    } catch {
      return null;
    }
  }, [input, options]);

  const handleConvert = useCallback(
    (svgStr: string) => {
      setInput(svgStr);
      if (!isLimited && svgStr.trim()) {
        recordUsage();
        trackAction("convert");
      }
    },
    [isLimited, recordUsage, trackAction],
  );

  const handleCopy = useCallback(() => {
    if (!result?.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  const handleDownload = useCallback(() => {
    if (!result?.output) return;
    const ext = options.outputMode === "typescript" ? "tsx" : options.outputMode === "component" ? "jsx" : "jsx";
    const blob = new Blob([result.output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${options.componentName || "SvgIcon"}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result, options]);

  // Preview the SVG
  const svgPreview = useMemo(() => {
    if (!input.trim()) return null;
    try {
      // Basic safety: only render if it looks like SVG
      if (!input.includes("<svg")) return null;
      return input;
    } catch {
      return null;
    }
  }, [input]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        SVG to JSX / React Component Converter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Paste an SVG and get JSX markup or a complete React component. Converts
        attributes to camelCase, handles style objects, removes XML cruft, and
        wraps in a component with props/ref support.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.label}
            onClick={() => handleConvert(s.svg)}
            className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Output Mode */}
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Output Mode
            </label>
            <select
              value={options.outputMode}
              onChange={(e) =>
                setOptions({ ...options, outputMode: e.target.value as OutputMode })
              }
              className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="jsx">JSX Only</option>
              <option value="component">React Component (JS)</option>
              <option value="typescript">React Component (TS)</option>
            </select>
          </div>

          {/* Component Name */}
          {options.outputMode !== "jsx" && (
            <div>
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">
                Component Name
              </label>
              <input
                type="text"
                value={options.componentName}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    componentName: e.target.value.replace(/[^a-zA-Z0-9]/g, ""),
                  })
                }
                placeholder="SvgIcon"
                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          {/* Toggles */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
              Options
            </label>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={options.removeDimensions}
                  onChange={(e) =>
                    setOptions({ ...options, removeDimensions: e.target.checked })
                  }
                  className="rounded"
                />
                Remove width/height
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={options.removeXmlns}
                  onChange={(e) =>
                    setOptions({ ...options, removeXmlns: e.target.checked })
                  }
                  className="rounded"
                />
                Remove xmlns
              </label>
              {options.outputMode !== "jsx" && (
                <>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={options.addProps}
                      onChange={(e) =>
                        setOptions({ ...options, addProps: e.target.checked })
                      }
                      className="rounded"
                    />
                    Spread props
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={options.addRef}
                      onChange={(e) =>
                        setOptions({ ...options, addRef: e.target.checked })
                      }
                      className="rounded"
                    />
                    forwardRef
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={options.memo}
                      onChange={(e) =>
                        setOptions({ ...options, memo: e.target.checked })
                      }
                      className="rounded"
                    />
                    memo
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={options.exportDefault}
                      onChange={(e) =>
                        setOptions({ ...options, exportDefault: e.target.checked })
                      }
                      className="rounded"
                    />
                    export default
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              SVG Input
            </label>
            {svgPreview && (
              <div
                className="w-10 h-10 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-900 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: svgPreview }}
              />
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => handleConvert(e.target.value)}
            placeholder={`Paste SVG here, e.g.:\n\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">\n  <path d="M12 2L2 7l10 5 10-5z" fill="currentColor"/>\n</svg>`}
            rows={20}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {options.outputMode === "jsx"
                ? "JSX Output"
                : options.outputMode === "typescript"
                  ? "TypeScript Component"
                  : "React Component"}
            </label>
            {result && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {result.attributeCount} attr{result.attributeCount !== 1 ? "s" : ""} converted,{" "}
                {result.elementCount} element{result.elementCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="relative">
            <pre className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 min-h-[30rem] max-h-[40rem] overflow-auto whitespace-pre-wrap break-all">
              {result?.output || (
                <span className="text-gray-400 dark:text-gray-500">
                  JSX output will appear here
                </span>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* Changes log */}
      {result && result.changes.length > 0 && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
          <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
            Changes applied ({result.changes.length})
          </h3>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
            {[...new Set(result.changes)].map((c, i) => {
              const count = result.changes.filter((x) => x === c).length;
              return (
                <li key={i}>
                  {c}
                  {count > 1 && ` (x${count})`}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Actions */}
      {result && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleCopy}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {copied ? "Copied!" : "Copy Output"}
          </button>
          {options.outputMode !== "jsx" && (
            <button
              onClick={handleDownload}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Download File
            </button>
          )}
          <button
            onClick={() => {
              setInput("");
              setCopied(false);
            }}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Clear
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About SVG to JSX Converter
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>Attribute conversion</strong> — converts 80+ SVG attributes
            from kebab-case to camelCase (stroke-width → strokeWidth,
            fill-opacity → fillOpacity).
          </li>
          <li>
            <strong>Style objects</strong> — transforms inline style strings to
            JSX-compatible style objects.
          </li>
          <li>
            <strong>Component wrapping</strong> — generates a complete React
            component with customizable name, props spread, forwardRef, and
            memo.
          </li>
          <li>
            <strong>TypeScript support</strong> — outputs typed components with
            SVGProps interface and optional custom props.
          </li>
          <li>
            <strong>Cleanup</strong> — removes XML declarations, comments,
            DOCTYPE, and namespace cruft automatically.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
