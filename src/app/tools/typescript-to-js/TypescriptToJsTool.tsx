"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Options ─────────────────────────────────────────────────────────────────

interface ConvertOptions {
  removeComments: boolean;
  convertEnums: boolean;
  preserveJSX: boolean;
  target: "modern" | "es5";
}

// ── Samples ─────────────────────────────────────────────────────────────────

const SAMPLES: { name: string; code: string }[] = [
  {
    name: "Interfaces & Types",
    code: `interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: Date;
}

type UserResponse = {
  data: User;
  status: number;
  message: string;
};

type ID = string | number;

function getUser(id: ID): Promise<UserResponse> {
  return fetch(\`/api/users/\${id}\`).then(
    (res) => res.json() as Promise<UserResponse>
  );
}

const formatUser = (user: User): string => {
  return \`\${user.name} (\${user.email})\`;
};`,
  },
  {
    name: "Classes & Enums",
    code: `enum Status {
  Active = "active",
  Inactive = "inactive",
  Pending = "pending",
}

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

abstract class BaseEntity {
  readonly id: string;
  protected createdAt: Date;

  constructor(id: string) {
    this.id = id;
    this.createdAt = new Date();
  }

  abstract validate(): boolean;
}

class UserService extends BaseEntity implements Serializable {
  private users: Map<string, User> = new Map();
  public status: Status = Status.Active;

  constructor(id: string) {
    super(id);
  }

  validate(): boolean {
    return this.users.size > 0;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  addUser(user: User): void {
    this.users.set(user.id as string, user);
  }
}`,
  },
  {
    name: "Generics & Utility Types",
    code: `function identity<T>(value: T): T {
  return value;
}

function merge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  return { ...target, ...source };
}

async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
  return response.json() as Promise<T>;
}

interface ApiResponse<T> {
  data: T;
  meta: {
    page: number;
    total: number;
  };
}

type Nullable<T> = T | null;
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: ReadonlyDeep<T[P]>;
};

const cache = new Map<string, unknown>();

function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T
): T {
  const memo = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (!memo.has(key)) {
      memo.set(key, fn(...args) as ReturnType<T>);
    }
    return memo.get(key)!;
  }) as T;
}`,
  },
  {
    name: "React Component",
    code: `import React, { useState, useEffect, useCallback } from "react";

interface ButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

function useCounter(initial: number = 0): UseCounterReturn {
  const [count, setCount] = useState<number>(initial);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, increment, decrement, reset };
}

const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
}) => {
  const classes = \`btn btn-\${variant} btn-\${size}\`;

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children ?? label}
    </button>
  );
};

export default Button;`,
  },
];

// ── TypeScript Transpiler ───────────────────────────────────────────────────

/**
 * Lightweight TypeScript → JavaScript transpiler.
 * Strips type annotations, interfaces, type aliases, enums, generics,
 * access modifiers, type assertions, and more — without the full TS compiler.
 */
function transpileTypeScript(input: string, options: ConvertOptions): {
  output: string;
  stats: { linesRemoved: number; typesStripped: number };
} {
  let typesStripped = 0;

  // Step 1: Protect strings, template literals, comments, and regex
  // from being modified by our transformations
  const segments: { type: "code" | "protected"; value: string }[] = [];
  let i = 0;
  const src = input;

  while (i < src.length) {
    // Single-line comment
    if (src[i] === "/" && src[i + 1] === "/") {
      let end = i + 2;
      while (end < src.length && src[end] !== "\n") end++;
      segments.push({ type: "protected", value: src.slice(i, end) });
      i = end;
      continue;
    }
    // Multi-line comment
    if (src[i] === "/" && src[i + 1] === "*") {
      let end = i + 2;
      while (end < src.length && !(src[end] === "*" && src[end + 1] === "/"))
        end++;
      end += 2;
      segments.push({ type: "protected", value: src.slice(i, end) });
      i = end;
      continue;
    }
    // Template literal (handle nested ${})
    if (src[i] === "`") {
      let end = i + 1;
      let depth = 0;
      while (end < src.length) {
        if (src[end] === "\\" && end + 1 < src.length) {
          end += 2;
          continue;
        }
        if (src[end] === "$" && src[end + 1] === "{") {
          depth++;
          end += 2;
          continue;
        }
        if (src[end] === "}" && depth > 0) {
          depth--;
          end++;
          continue;
        }
        if (src[end] === "`" && depth === 0) {
          end++;
          break;
        }
        end++;
      }
      segments.push({ type: "protected", value: src.slice(i, end) });
      i = end;
      continue;
    }
    // Double/single-quoted string
    if (src[i] === '"' || src[i] === "'") {
      const quote = src[i];
      let end = i + 1;
      while (end < src.length) {
        if (src[end] === "\\") {
          end += 2;
          continue;
        }
        if (src[end] === quote) {
          end++;
          break;
        }
        end++;
      }
      segments.push({ type: "protected", value: src.slice(i, end) });
      i = end;
      continue;
    }
    // Regular code character — accumulate
    const last = segments[segments.length - 1];
    if (last && last.type === "code") {
      last.value += src[i];
    } else {
      segments.push({ type: "code", value: src[i] });
    }
    i++;
  }

  // Step 2: Process code segments
  function processCode(code: string): string {
    let result = code;

    // 2a. Remove standalone interface declarations (multi-line)
    result = result.replace(
      /^(export\s+)?interface\s+\w+(?:\s+extends\s+[\w.,\s<>]+?)?\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}\s*;?\s*$/gm,
      () => {
        typesStripped++;
        return "";
      }
    );
    // Handle deeply nested interfaces (up to 3 levels)
    result = result.replace(
      /^(export\s+)?interface\s+\w+[\s\S]*?^}\s*;?\s*$/gm,
      (match) => {
        // Verify this is a complete interface (balanced braces)
        let depth = 0;
        for (const ch of match) {
          if (ch === "{") depth++;
          if (ch === "}") depth--;
        }
        if (depth === 0) {
          typesStripped++;
          return "";
        }
        return match;
      }
    );

    // 2b. Remove standalone type alias declarations
    // Single-line: type Foo = ...;
    result = result.replace(
      /^(export\s+)?type\s+\w+(?:<[^>]*>)?\s*=\s*[^;{]*;\s*$/gm,
      () => {
        typesStripped++;
        return "";
      }
    );
    // Multi-line type aliases (with braces)
    result = result.replace(
      /^(export\s+)?type\s+\w+(?:<[^>]*>)?\s*=\s*\{[\s\S]*?^};\s*$/gm,
      (match) => {
        let depth = 0;
        for (const ch of match) {
          if (ch === "{") depth++;
          if (ch === "}") depth--;
        }
        if (depth === 0) {
          typesStripped++;
          return "";
        }
        return match;
      }
    );

    // 2c. Remove declare statements
    result = result.replace(
      /^(export\s+)?declare\s+(?:const|let|var|function|class|module|namespace|global|enum|type|interface)\s+[\s\S]*?(?:;|\})\s*$/gm,
      () => {
        typesStripped++;
        return "";
      }
    );

    // 2d. Convert enums to objects
    if (options.convertEnums) {
      result = result.replace(
        /^(export\s+)?(const\s+)?enum\s+(\w+)\s*\{([^}]*)\}/gm,
        (_match, exportKw, _constKw, name, body) => {
          typesStripped++;
          const members = body
            .split(",")
            .map((m: string) => m.trim())
            .filter((m: string) => m.length > 0);
          let autoIndex = 0;
          const entries = members.map((member: string) => {
            const parts = member.split("=").map((p: string) => p.trim());
            const key = parts[0];
            let value: string;
            if (parts.length > 1) {
              value = parts[1];
              // If it's a numeric value, update autoIndex
              const num = Number(value);
              if (!isNaN(num)) autoIndex = num + 1;
            } else {
              value = String(autoIndex);
              autoIndex++;
            }
            return `  ${key}: ${value}`;
          });
          const exp = exportKw ? "export " : "";
          return `${exp}const ${name} = {\n${entries.join(",\n")}\n}`;
        }
      );
    } else {
      // Remove enums entirely if not converting
      result = result.replace(
        /^(export\s+)?(const\s+)?enum\s+\w+\s*\{[^}]*\}\s*;?\s*$/gm,
        () => {
          typesStripped++;
          return "";
        }
      );
    }

    // 2e. Remove access modifiers from class members
    result = result.replace(
      /^(\s*)(public|private|protected)\s+(readonly\s+)?/gm,
      (_m, indent, _mod, readonly) => {
        typesStripped++;
        return `${indent}${readonly && options.target !== "es5" ? "" : ""}`;
      }
    );
    result = result.replace(/^(\s*)readonly\s+/gm, (match, indent) => {
      typesStripped++;
      return `${indent}`;
    });
    result = result.replace(
      /^(\s*)(abstract|override)\s+/gm,
      (_m, indent) => {
        typesStripped++;
        return `${indent}`;
      }
    );

    // 2f. Remove 'implements' clause from class declarations
    result = result.replace(
      /(\bclass\s+\w+(?:\s+extends\s+\w+(?:<[^>]*>)?)?)\s+implements\s+[\w<>,.\s]+/g,
      (_, before) => {
        typesStripped++;
        return before;
      }
    );

    // 2g. Remove 'abstract' keyword from class declarations
    result = result.replace(/\babstract\s+(class\s+)/g, (_m, cls) => {
      typesStripped++;
      return cls;
    });

    // 2h. Remove generic type parameters from function/class declarations
    // e.g., function foo<T, U extends Bar>(...) → function foo(...)
    result = result.replace(
      /((?:function|class)\s+\w+)\s*<[^(]*?>/g,
      (_, before) => {
        typesStripped++;
        return before;
      }
    );
    // Arrow functions with generics: const foo = <T,>(...) or <T extends X>(...)
    result = result.replace(
      /=\s*<[^=]*?>\s*\(/g,
      (match) => {
        // Only strip if it looks like a generic, not JSX
        if (match.includes("extends") || match.includes(",")) {
          typesStripped++;
          return "= (";
        }
        return match;
      }
    );

    // 2i. Remove 'as Type' assertions
    result = result.replace(
      /\s+as\s+(?:const|(?:(?:typeof\s+)?\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*))/g,
      () => {
        typesStripped++;
        return "";
      }
    );

    // 2j. Remove 'satisfies' expressions
    result = result.replace(
      /\s+satisfies\s+\w+(?:\.\w+)*(?:<[^>]*>)?/g,
      () => {
        typesStripped++;
        return "";
      }
    );

    // 2k. Remove return type annotations
    // function(...): ReturnType { or => ReturnType
    result = result.replace(
      /(\))\s*:\s*(?:Promise<[^>]*>|(?:typeof\s+)?\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*(?:\s*\|\s*\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*)*)\s*(\{|=>|$)/gm,
      (_, paren, after) => {
        typesStripped++;
        return `${paren} ${after}`;
      }
    );

    // 2l. Remove parameter type annotations
    // Match: paramName: Type or paramName?: Type
    result = result.replace(
      /(\w+)(\??):\s*(?:(?:typeof\s+)?\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*(?:\s*\|\s*(?:typeof\s+)?\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*)*)/g,
      (match, name, optional, _offset) => {
        // Don't strip object key type annotations like { key: value }
        // Check if this is inside a function parameter context or variable declaration
        // Simple heuristic: if the name starts with uppercase, it might be a type
        // We need to be careful not to strip object properties
        // Only strip if in a function-like context or variable declaration
        typesStripped++;
        return `${name}${optional ? "" : ""}`;
      }
    );

    // 2m. Remove variable type annotations (const/let/var x: Type = ...)
    result = result.replace(
      /((?:const|let|var)\s+\w+)\s*:\s*(?:(?:typeof\s+)?\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*(?:\s*\|\s*(?:typeof\s+)?\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])*)*)\s*(=)/g,
      (_, decl, eq) => {
        typesStripped++;
        return `${decl} ${eq}`;
      }
    );

    // 2n. Remove non-null assertions (!)
    // Be careful not to remove ! from !== or !=
    result = result.replace(/(\w+|\)|\])!(?=[.;\s,)\]}])/g, (_, before) => {
      typesStripped++;
      return before;
    });

    // 2o. Remove angle-bracket type assertions: <Type>expr
    // Only outside JSX context
    if (!options.preserveJSX) {
      result = result.replace(
        /<(\w+(?:\.\w+)*)>(\w)/g,
        (_, _type, expr) => {
          typesStripped++;
          return expr;
        }
      );
    }

    // 2p. Clean up React.FC type
    result = result.replace(
      /:\s*React\.FC(?:<[^>]*>)?/g,
      () => {
        typesStripped++;
        return "";
      }
    );

    // 2q. Remove 'definite assignment' assertions from class properties
    result = result.replace(/(\w+)!:/g, (_, name) => {
      typesStripped++;
      return `${name}:`;
    });

    return result;
  }

  // Step 3: Apply transformations
  const outputSegments = segments.map((seg) => {
    if (seg.type === "code") {
      return processCode(seg.value);
    }
    if (options.removeComments && seg.type === "protected") {
      // Check if this is a comment
      if (
        seg.value.startsWith("//") ||
        seg.value.startsWith("/*")
      ) {
        return "";
      }
    }
    return seg.value;
  });

  let output = outputSegments.join("");

  // Step 4: Clean up empty lines (collapse 3+ newlines to 2)
  output = output.replace(/\n{3,}/g, "\n\n");
  // Remove trailing whitespace on lines
  output = output.replace(/[ \t]+$/gm, "");
  // Trim leading/trailing whitespace
  output = output.trim() + "\n";

  const inputLines = input.split("\n").length;
  const outputLines = output.split("\n").length;

  return {
    output,
    stats: {
      linesRemoved: Math.max(0, inputLines - outputLines),
      typesStripped,
    },
  };
}

// ── Component ───────────────────────────────────────────────────────────────

export default function TypescriptToJsTool() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<ConvertOptions>({
    removeComments: false,
    convertEnums: true,
    preserveJSX: true,
    target: "modern",
  });
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("typescript-to-js");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("typescript-to-js");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return transpileTypeScript(input, options);
    } catch {
      return null;
    }
  }, [input, options]);

  const handleConvert = useCallback(() => {
    if (!input.trim() || isLimited) return;
    recordUsage();
    trackAction("convert");
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleConvert);

  const copyOutput = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    trackAction("copy");
    setTimeout(() => setCopied(false), 2000);
  }, [result, trackAction]);

  const downloadOutput = useCallback(() => {
    if (!result) return;
    const ext = options.preserveJSX ? ".jsx" : ".js";
    const blob = new Blob([result.output], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    trackAction("download");
  }, [result, options.preserveJSX, trackAction]);

  const loadSample = useCallback(
    (idx: number) => {
      setInput(SAMPLES[idx].code);
      trackAction("sample");
    },
    [trackAction]
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        TypeScript to JavaScript Converter
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Strip TypeScript types, interfaces, enums, and generics to get clean
        JavaScript. Paste your .ts or .tsx code and get .js output instantly.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      {/* Samples */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 self-center">
          Samples:
        </span>
        {SAMPLES.map((sample, idx) => (
          <button
            key={sample.name}
            onClick={() => loadSample(idx)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={options.convertEnums}
            onChange={(e) =>
              setOptions((o) => ({ ...o, convertEnums: e.target.checked }))
            }
            className="rounded"
          />
          Convert enums to objects
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={options.removeComments}
            onChange={(e) =>
              setOptions((o) => ({ ...o, removeComments: e.target.checked }))
            }
            className="rounded"
          />
          Remove comments
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={options.preserveJSX}
            onChange={(e) =>
              setOptions((o) => ({ ...o, preserveJSX: e.target.checked }))
            }
            className="rounded"
          />
          Preserve JSX
        </label>
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Input */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              TypeScript Input
            </label>
            <span className="text-xs text-gray-400">
              .ts / .tsx
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`// Paste your TypeScript code here\ninterface User {\n  id: number;\n  name: string;\n}\n\nfunction greet(user: User): string {\n  return \`Hello, \${user.name}\`;\n}`}
            spellCheck={false}
            className="h-[480px] w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-blue-400"
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              JavaScript Output
            </label>
            <div className="flex gap-2">
              {result && (
                <>
                  <button
                    onClick={copyOutput}
                    className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={downloadOutput}
                    className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={result?.output ?? ""}
            readOnly
            placeholder="// JavaScript output will appear here..."
            spellCheck={false}
            className="h-[480px] w-full rounded-lg border border-gray-300 bg-gray-50 p-4 font-mono text-sm text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Stats */}
      {result && (
        <div className="mt-4 flex flex-wrap gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {result.stats.typesStripped}
            </span>{" "}
            type annotations stripped
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {result.stats.linesRemoved}
            </span>{" "}
            lines removed
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {input.split("\n").length}
            </span>{" "}
            → {result.output.split("\n").length} lines
          </div>
        </div>
      )}

      {/* Keyboard shortcut hint */}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        Ctrl+Enter to copy output &middot; Conversion is instant as you type
      </p>

      {/* Related tools */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Related Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/tools/json-to-typescript", label: "JSON to TypeScript" },
            { href: "/tools/tsconfig-builder", label: "tsconfig.json Builder" },
            {
              href: "/tools/graphql-to-typescript",
              label: "GraphQL to TypeScript",
            },
            { href: "/tools/html-to-jsx", label: "HTML to JSX" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
