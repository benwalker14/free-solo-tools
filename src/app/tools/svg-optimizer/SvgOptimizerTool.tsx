"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useSmartPasteInput } from "@/hooks/useSmartPasteInput";
import RateLimitBanner from "@/components/RateLimitBanner";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

interface OptimizeOptions {
  removeComments: boolean;
  removeMetadata: boolean;
  removeEditorData: boolean;
  removeEmptyGroups: boolean;
  removeDefaultAttrs: boolean;
  minifyWhitespace: boolean;
  removeDimensions: boolean;
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  removeComments: true,
  removeMetadata: true,
  removeEditorData: true,
  removeEmptyGroups: true,
  removeDefaultAttrs: true,
  minifyWhitespace: true,
  removeDimensions: false,
};

// Editor-specific namespace prefixes
const EDITOR_NAMESPACES = [
  "sodipodi",
  "inkscape",
  "sketch",
  "illustrator",
  "serif",
  "vectornator",
];

// Editor-specific elements to remove
const EDITOR_ELEMENTS = [
  "sodipodi:namedview",
  "inkscape:grid",
  "sketch:MSPage",
  "sketch:MSLayerGroup",
  "sketch:MSShapeGroup",
];

// Default attribute values that can be safely removed
const DEFAULT_ATTRS: Record<string, string> = {
  "fill-opacity": "1",
  "stroke-opacity": "1",
  opacity: "1",
  "stroke-width": "1",
  "stroke-dashoffset": "0",
  "stroke-linecap": "butt",
  "stroke-linejoin": "miter",
  "stroke-miterlimit": "4",
  "font-style": "normal",
  "font-variant": "normal",
  "font-weight": "normal",
  "text-decoration": "none",
  "text-anchor": "start",
  visibility: "visible",
  display: "inline",
  overflow: "visible",
  "fill-rule": "nonzero",
  "clip-rule": "nonzero",
  "color-interpolation": "sRGB",
  "color-interpolation-filters": "linearRGB",
};

function optimizeSvg(svgString: string, options: OptimizeOptions): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  // Check for parse errors
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid SVG: " + (errorNode.textContent || "Parse error"));
  }

  const svg = doc.documentElement;

  // Remove comments
  if (options.removeComments) {
    const walker = doc.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
    const comments: Comment[] = [];
    while (walker.nextNode()) {
      comments.push(walker.currentNode as Comment);
    }
    for (const comment of comments) {
      comment.parentNode?.removeChild(comment);
    }
  }

  // Remove metadata elements
  if (options.removeMetadata) {
    const metadataEls = svg.querySelectorAll("metadata");
    for (const el of metadataEls) {
      el.parentNode?.removeChild(el);
    }
    // Remove <title> and <desc> from non-root elements
    for (const tag of ["title", "desc"]) {
      const els = svg.querySelectorAll(tag);
      for (const el of els) {
        if (el.parentElement !== svg) {
          el.parentNode?.removeChild(el);
        }
      }
    }
  }

  // Remove editor-specific elements and attributes
  if (options.removeEditorData) {
    // Remove editor-specific elements
    for (const selector of EDITOR_ELEMENTS) {
      const parts = selector.split(":");
      const els = svg.getElementsByTagNameNS("*", parts[1] || parts[0]);
      const toRemove: Element[] = [];
      for (let i = 0; i < els.length; i++) {
        toRemove.push(els[i]);
      }
      for (const el of toRemove) {
        el.parentNode?.removeChild(el);
      }
    }

    // Remove editor namespace attributes from all elements
    const allEls = svg.querySelectorAll("*");
    const removeAttrs = (el: Element) => {
      const attrsToRemove: string[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        const name = attr.name.toLowerCase();
        // Remove editor namespace declarations and attributes
        for (const ns of EDITOR_NAMESPACES) {
          if (name === `xmlns:${ns}` || name.startsWith(`${ns}:`)) {
            attrsToRemove.push(attr.name);
          }
        }
        // Remove data-* attributes
        if (name.startsWith("data-")) {
          attrsToRemove.push(attr.name);
        }
      }
      for (const name of attrsToRemove) {
        el.removeAttribute(name);
      }
    };
    removeAttrs(svg);
    for (const el of allEls) {
      removeAttrs(el);
    }
  }

  // Remove empty groups
  if (options.removeEmptyGroups) {
    let changed = true;
    while (changed) {
      changed = false;
      const groups = svg.querySelectorAll("g, defs");
      for (const g of groups) {
        if (g.children.length === 0 && !g.textContent?.trim()) {
          g.parentNode?.removeChild(g);
          changed = true;
        }
      }
    }
    // Unwrap groups with no attributes and single child
    const singleGroups = svg.querySelectorAll("g");
    for (const g of singleGroups) {
      if (g.attributes.length === 0 && g.children.length === 1) {
        const child = g.children[0];
        g.parentNode?.replaceChild(child, g);
      }
    }
  }

  // Remove default attribute values
  if (options.removeDefaultAttrs) {
    const allEls = svg.querySelectorAll("*");
    for (const el of allEls) {
      for (const [attr, defaultVal] of Object.entries(DEFAULT_ATTRS)) {
        if (el.getAttribute(attr) === defaultVal) {
          el.removeAttribute(attr);
        }
      }
      // Remove empty style attributes
      if (el.getAttribute("style") === "") {
        el.removeAttribute("style");
      }
      // Remove empty class attributes
      if (el.getAttribute("class") === "") {
        el.removeAttribute("class");
      }
    }
  }

  // Remove width/height if viewBox exists (use viewBox for responsive SVGs)
  if (options.removeDimensions) {
    if (svg.getAttribute("viewBox")) {
      svg.removeAttribute("width");
      svg.removeAttribute("height");
    }
  }

  // Serialize back to string
  const serializer = new XMLSerializer();
  let result = serializer.serializeToString(svg);

  // Clean up xmlns:ns0 artifacts from XMLSerializer
  result = result.replace(/\s*xmlns:ns\d+="[^"]*"/g, "");
  result = result.replace(/ns\d+:/g, "");

  // Minify whitespace
  if (options.minifyWhitespace) {
    // Collapse multiple whitespace between tags
    result = result.replace(/>\s+</g, "><");
    // Remove leading/trailing whitespace in attribute values
    result = result.replace(/\s{2,}/g, " ");
  } else {
    // Pretty-print with indentation
    result = prettifySvg(result);
  }

  return result;
}

function prettifySvg(svg: string): string {
  // Simple XML pretty-printer
  let result = "";
  let indent = 0;
  const step = "  ";

  // Split on tags while preserving them
  const tokens = svg.split(/(<[^>]+>)/);

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      // Closing tag - decrease indent first
      indent = Math.max(0, indent - 1);
      result += step.repeat(indent) + trimmed + "\n";
    } else if (trimmed.startsWith("<") && trimmed.endsWith("/>")) {
      // Self-closing tag
      result += step.repeat(indent) + trimmed + "\n";
    } else if (trimmed.startsWith("<?") || trimmed.startsWith("<!")) {
      // Processing instruction or doctype
      result += step.repeat(indent) + trimmed + "\n";
    } else if (trimmed.startsWith("<")) {
      // Opening tag - output then increase indent
      result += step.repeat(indent) + trimmed + "\n";
      indent++;
    } else {
      // Text content
      result += step.repeat(indent) + trimmed + "\n";
    }
  }

  return result.trimEnd();
}

const SAMPLE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generator: Adobe Illustrator 24.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" viewBox="0 0 200 200" width="200" height="200" fill-opacity="1" stroke-opacity="1">
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <rdf:Description>
        <dc:title>Sample Icon</dc:title>
        <dc:creator>Designer</dc:creator>
      </rdf:Description>
    </rdf:RDF>
  </metadata>
  <sodipodi:namedview pagecolor="#ffffff" bordercolor="#666666" borderopacity="1"/>
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <g>
    <g>
      <!-- Background circle -->
      <circle cx="100" cy="100" r="90" fill="url(#grad1)" stroke="none" display="inline" visibility="visible"/>
    </g>
    <g>
      <!-- Lightning bolt icon -->
      <path d="M110 40 L80 105 L105 105 L90 160 L130 90 L105 90 Z" fill="white" stroke="none" fill-rule="nonzero"/>
    </g>
  </g>
  <!-- End of icon -->
</svg>`;

export default function SvgOptimizerTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [previewSvg, setPreviewSvg] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [options, setOptions] = useState<OptimizeOptions>(DEFAULT_OPTIONS);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("svg-optimizer");
  const { trackAction } = useToolAnalytics("svg-optimizer");
  useSmartPasteInput(setInput);

  const inputSize = new Blob([input]).size;
  const outputSize = output ? new Blob([output]).size : 0;
  const savings =
    inputSize > 0 && outputSize > 0
      ? (((inputSize - outputSize) / inputSize) * 100).toFixed(1)
      : null;

  const handleOptimize = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("optimize");
    setError("");
    setOutput("");
    setCopied(false);

    if (!input.trim()) {
      setError("Please enter or upload an SVG to optimize.");
      return;
    }

    try {
      const result = optimizeSvg(input, options);
      setOutput(result);
      setPreviewSvg(result);
      setShowOriginal(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error optimizing SVG");
    }
  }, [input, options, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleOptimize);

  const handlePreview = useCallback(() => {
    if (!input.trim()) {
      setError("Please enter or upload an SVG to preview.");
      return;
    }
    setError("");
    setPreviewSvg(input);
    setShowOriginal(true);
  }, [input]);

  const handleCopy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleLoadSample = () => {
    setInput(SAMPLE_SVG);
    setOutput("");
    setError("");
    setPreviewSvg("");
    setCopied(false);
  };

  const loadFile = useCallback(
    (file: File) => {
      if (isLimited) return;
      setError("");
      setCopied(false);

      if (!file.name.endsWith(".svg") && file.type !== "image/svg+xml") {
        setError("Please select an SVG file.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File too large. Maximum size is 5 MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setInput(text);
        setOutput("");
        setPreviewSvg("");
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsText(file);
    },
    [isLimited]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  const toggleOption = (key: keyof OptimizeOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        SVG Optimizer &amp; Viewer
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Optimize SVGs by removing metadata, comments, editor cruft, and
        unnecessary attributes. Preview before and after.
      </p>

      {/* File upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors mb-4 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
            : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-600 dark:hover:bg-gray-800"
        }`}
      >
        <svg
          className="mb-2 h-8 w-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Drop an SVG file here or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-500">SVG files — max 5 MB</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Or paste directly */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Or paste your SVG markup here..."
        rows={10}
        spellCheck={false}
        className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />

      {/* Input size indicator */}
      {input && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          Input size: {formatBytes(inputSize)}
        </p>
      )}

      {/* Optimization options */}
      <details className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700" open>
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Optimization Options
        </summary>
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(
            [
              ["removeComments", "Remove comments"],
              ["removeMetadata", "Remove metadata"],
              ["removeEditorData", "Remove editor data (Inkscape, Illustrator)"],
              ["removeEmptyGroups", "Remove empty groups / unwrap singles"],
              ["removeDefaultAttrs", "Remove default attribute values"],
              ["minifyWhitespace", "Minify whitespace"],
              ["removeDimensions", "Remove width/height (keep viewBox)"],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <input
                type="checkbox"
                checked={options[key]}
                onChange={() => toggleOption(key)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {label}
            </label>
          ))}
        </div>
      </details>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={handleOptimize}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Optimize{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>
        <button
          onClick={handlePreview}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          Preview Original
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
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {/* SVG Preview */}
      {previewSvg && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {showOriginal ? "Original Preview" : "Optimized Preview"}
          </h2>
          <div className="rounded-lg border border-gray-200 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-6 dark:border-gray-700 dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)] flex items-center justify-center min-h-[200px]">
            <div
              className="max-w-full max-h-[400px] [&>svg]:max-w-full [&>svg]:max-h-[400px] [&>svg]:w-auto [&>svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: previewSvg }}
            />
          </div>
        </div>
      )}

      {/* Output stats and result */}
      {output && (
        <div className="mt-6 space-y-3">
          {/* Stats bar */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                Original:
              </span>{" "}
              {formatBytes(inputSize)}
            </span>
            <span>
              <span className="font-medium text-gray-900 dark:text-gray-200">
                Optimized:
              </span>{" "}
              {formatBytes(outputSize)}
            </span>
            {savings && (
              <span className="font-medium text-green-600 dark:text-green-400">
                {Number(savings) > 0 ? `${savings}% smaller` : "No reduction"}
              </span>
            )}
          </div>

          {/* Output code */}
          <div className="relative rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">
            <div className="absolute right-2 top-2 flex gap-1">
              <button
                onClick={handleCopy}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Download
              </button>
            </div>
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

      {/* About section */}
      <details className="mt-8 rounded-lg border border-gray-200 dark:border-gray-700">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          About SVG Optimization
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 space-y-3">
          <p>
            SVG files exported from design tools like Illustrator, Inkscape,
            Figma, and Sketch often contain metadata, editor-specific
            attributes, comments, and other unnecessary data that increase file
            size without affecting the visual output.
          </p>
          <p>
            <strong>What gets removed:</strong> XML comments, metadata elements
            (RDF, Dublin Core), editor namespaces and attributes (Inkscape,
            Illustrator, Sodipodi), empty groups and defs, default attribute
            values (fill-opacity=&quot;1&quot;, display=&quot;inline&quot;, etc.), and redundant
            whitespace.
          </p>
          <p>
            <strong>Safe optimization:</strong> This tool only removes data
            that does not affect how the SVG renders. All visual elements,
            gradients, filters, and transformations are preserved. Use the
            preview to verify the output before downloading.
          </p>
          <p>
            <strong>Responsive SVGs:</strong> Enable &quot;Remove width/height&quot; to
            strip fixed dimensions while keeping the viewBox attribute, making
            your SVG scale responsively to its container.
          </p>
        </div>
      </details>
    </div>
  );
}
