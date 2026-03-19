"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import RateLimitBanner from "@/components/RateLimitBanner";

// ── Types ──

type ThemeId =
  | "dracula"
  | "monokai"
  | "github-dark"
  | "one-dark"
  | "nord"
  | "solarized-dark"
  | "night-owl"
  | "github-light";

type LanguageId =
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "csharp"
  | "html"
  | "css"
  | "json"
  | "bash"
  | "sql"
  | "plain";

type BackgroundStyle =
  | "gradient-purple"
  | "gradient-blue"
  | "gradient-green"
  | "gradient-orange"
  | "gradient-pink"
  | "gradient-dark"
  | "solid-dark"
  | "solid-white"
  | "transparent";

interface Theme {
  id: ThemeId;
  name: string;
  bg: string;
  text: string;
  keyword: string;
  string: string;
  comment: string;
  number: string;
  function: string;
  operator: string;
  type: string;
  windowBg: string;
  windowBorder: string;
}

const THEMES: Theme[] = [
  {
    id: "dracula",
    name: "Dracula",
    bg: "#282a36",
    text: "#f8f8f2",
    keyword: "#ff79c6",
    string: "#f1fa8c",
    comment: "#6272a4",
    number: "#bd93f9",
    function: "#50fa7b",
    operator: "#ff79c6",
    type: "#8be9fd",
    windowBg: "#21222c",
    windowBorder: "#44475a",
  },
  {
    id: "monokai",
    name: "Monokai",
    bg: "#272822",
    text: "#f8f8f2",
    keyword: "#f92672",
    string: "#e6db74",
    comment: "#75715e",
    number: "#ae81ff",
    function: "#a6e22e",
    operator: "#f92672",
    type: "#66d9ef",
    windowBg: "#1e1f1c",
    windowBorder: "#3e3d32",
  },
  {
    id: "github-dark",
    name: "GitHub Dark",
    bg: "#0d1117",
    text: "#c9d1d9",
    keyword: "#ff7b72",
    string: "#a5d6ff",
    comment: "#8b949e",
    number: "#79c0ff",
    function: "#d2a8ff",
    operator: "#ff7b72",
    type: "#79c0ff",
    windowBg: "#010409",
    windowBorder: "#30363d",
  },
  {
    id: "one-dark",
    name: "One Dark",
    bg: "#282c34",
    text: "#abb2bf",
    keyword: "#c678dd",
    string: "#98c379",
    comment: "#5c6370",
    number: "#d19a66",
    function: "#61afef",
    operator: "#c678dd",
    type: "#e5c07b",
    windowBg: "#21252b",
    windowBorder: "#3a3f4b",
  },
  {
    id: "nord",
    name: "Nord",
    bg: "#2e3440",
    text: "#d8dee9",
    keyword: "#81a1c1",
    string: "#a3be8c",
    comment: "#616e88",
    number: "#b48ead",
    function: "#88c0d0",
    operator: "#81a1c1",
    type: "#8fbcbb",
    windowBg: "#242933",
    windowBorder: "#3b4252",
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    bg: "#002b36",
    text: "#839496",
    keyword: "#859900",
    string: "#2aa198",
    comment: "#586e75",
    number: "#d33682",
    function: "#268bd2",
    operator: "#859900",
    type: "#b58900",
    windowBg: "#00212b",
    windowBorder: "#073642",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    bg: "#011627",
    text: "#d6deeb",
    keyword: "#c792ea",
    string: "#ecc48d",
    comment: "#637777",
    number: "#f78c6c",
    function: "#82aaff",
    operator: "#c792ea",
    type: "#ffcb8b",
    windowBg: "#001122",
    windowBorder: "#1d3b53",
  },
  {
    id: "github-light",
    name: "GitHub Light",
    bg: "#ffffff",
    text: "#24292f",
    keyword: "#cf222e",
    string: "#0a3069",
    comment: "#6e7781",
    number: "#0550ae",
    function: "#8250df",
    operator: "#cf222e",
    type: "#0550ae",
    windowBg: "#f6f8fa",
    windowBorder: "#d0d7de",
  },
];

const LANGUAGES: { id: LanguageId; label: string }[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "bash", label: "Bash" },
  { id: "sql", label: "SQL" },
  { id: "plain", label: "Plain Text" },
];

const BACKGROUNDS: { id: BackgroundStyle; label: string; preview: string }[] = [
  {
    id: "gradient-purple",
    label: "Purple",
    preview: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    id: "gradient-blue",
    label: "Blue",
    preview: "linear-gradient(135deg, #2193b0, #6dd5ed)",
  },
  {
    id: "gradient-green",
    label: "Green",
    preview: "linear-gradient(135deg, #11998e, #38ef7d)",
  },
  {
    id: "gradient-orange",
    label: "Orange",
    preview: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    id: "gradient-pink",
    label: "Pink",
    preview: "linear-gradient(135deg, #ee9ca7, #ffdde1)",
  },
  {
    id: "gradient-dark",
    label: "Dark",
    preview: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  },
  {
    id: "solid-dark",
    label: "Solid Dark",
    preview: "#1a1a2e",
  },
  {
    id: "solid-white",
    label: "Solid White",
    preview: "#f0f0f0",
  },
  {
    id: "transparent",
    label: "None",
    preview:
      "repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 12px 12px",
  },
];

const PADDING_OPTIONS = [16, 32, 48, 64, 80];
const FONT_SIZE_OPTIONS = [12, 14, 16, 18, 20];

const SAMPLE_CODE = `function fibonacci(n) {
  // Base cases
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

// Generate first 10 numbers
const result = Array.from(
  { length: 10 },
  (_, i) => fibonacci(i)
);
console.log(result);`;

// ── Simple syntax tokenizer ──

interface Token {
  text: string;
  type: "keyword" | "string" | "comment" | "number" | "function" | "operator" | "type" | "text";
}

const KEYWORDS: Record<string, Set<string>> = {
  javascript: new Set([
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "do", "switch", "case", "break", "continue", "new", "this", "class",
    "extends", "import", "export", "from", "default", "async", "await",
    "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of",
    "true", "false", "null", "undefined", "yield", "delete", "void",
  ]),
  typescript: new Set([
    "const", "let", "var", "function", "return", "if", "else", "for", "while",
    "do", "switch", "case", "break", "continue", "new", "this", "class",
    "extends", "import", "export", "from", "default", "async", "await",
    "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of",
    "true", "false", "null", "undefined", "type", "interface", "enum",
    "implements", "abstract", "readonly", "as", "is", "keyof", "never",
  ]),
  python: new Set([
    "def", "class", "return", "if", "elif", "else", "for", "while", "import",
    "from", "as", "try", "except", "finally", "raise", "with", "pass",
    "break", "continue", "lambda", "yield", "global", "nonlocal", "assert",
    "del", "in", "not", "and", "or", "is", "True", "False", "None", "async",
    "await", "self",
  ]),
  go: new Set([
    "func", "return", "if", "else", "for", "range", "switch", "case",
    "default", "break", "continue", "go", "select", "chan", "defer", "map",
    "struct", "interface", "type", "package", "import", "var", "const",
    "true", "false", "nil", "make", "len", "append", "fmt",
  ]),
  rust: new Set([
    "fn", "let", "mut", "return", "if", "else", "for", "while", "loop",
    "match", "struct", "enum", "impl", "trait", "use", "mod", "pub", "crate",
    "self", "super", "as", "in", "ref", "move", "async", "await", "where",
    "true", "false", "Some", "None", "Ok", "Err",
  ]),
  java: new Set([
    "public", "private", "protected", "static", "final", "class", "interface",
    "extends", "implements", "return", "if", "else", "for", "while", "do",
    "switch", "case", "break", "continue", "new", "this", "super", "import",
    "package", "try", "catch", "finally", "throw", "throws", "void",
    "true", "false", "null", "abstract", "synchronized",
  ]),
  csharp: new Set([
    "public", "private", "protected", "static", "class", "interface", "struct",
    "return", "if", "else", "for", "foreach", "while", "do", "switch", "case",
    "break", "continue", "new", "this", "base", "using", "namespace", "try",
    "catch", "finally", "throw", "void", "var", "async", "await", "true",
    "false", "null", "string", "int", "bool", "double", "readonly", "override",
  ]),
  html: new Set([]),
  css: new Set([
    "important", "inherit", "initial", "unset", "none", "auto", "block",
    "inline", "flex", "grid", "relative", "absolute", "fixed", "sticky",
  ]),
  json: new Set(["true", "false", "null"]),
  bash: new Set([
    "if", "then", "else", "elif", "fi", "for", "while", "do", "done", "case",
    "esac", "function", "return", "in", "echo", "export", "local", "readonly",
    "cd", "ls", "grep", "awk", "sed", "cat", "mkdir", "rm", "cp", "mv",
  ]),
  sql: new Set([
    "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
    "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "JOIN", "LEFT",
    "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "IN", "AS", "ORDER",
    "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "NULL", "TRUE", "FALSE",
    "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "DISTINCT", "COUNT", "SUM",
    "AVG", "MAX", "MIN", "LIKE", "BETWEEN", "EXISTS", "UNION", "ALL",
    "select", "from", "where", "insert", "into", "values", "update", "set",
    "delete", "create", "table", "alter", "drop", "join", "left", "right",
    "inner", "outer", "on", "and", "or", "not", "in", "as", "order", "by",
    "group", "having", "limit", "null", "true", "false", "primary", "key",
  ]),
  plain: new Set([]),
};

function tokenizeLine(line: string, lang: LanguageId): Token[] {
  const tokens: Token[] = [];
  const keywords = KEYWORDS[lang] || new Set();
  let i = 0;

  while (i < line.length) {
    // Comments: // or #
    if (
      (line[i] === "/" && line[i + 1] === "/") ||
      (lang === "python" && line[i] === "#") ||
      (lang === "bash" && line[i] === "#")
    ) {
      tokens.push({ text: line.slice(i), type: "comment" });
      break;
    }

    // HTML comments
    if (lang === "html" && line.slice(i, i + 4) === "<!--") {
      const end = line.indexOf("-->", i + 4);
      const text = end >= 0 ? line.slice(i, end + 3) : line.slice(i);
      tokens.push({ text, type: "comment" });
      i += text.length;
      continue;
    }

    // SQL comments: --
    if (lang === "sql" && line[i] === "-" && line[i + 1] === "-") {
      tokens.push({ text: line.slice(i), type: "comment" });
      break;
    }

    // Strings
    if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, line.length);
      tokens.push({ text: line.slice(i, j), type: "string" });
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.xXa-fA-F_]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: "number" });
      i = j;
      continue;
    }

    // Words (keywords, identifiers)
    if (/[a-zA-Z_$@]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[\w$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (keywords.has(word)) {
        tokens.push({ text: word, type: "keyword" });
      } else if (j < line.length && line[j] === "(") {
        tokens.push({ text: word, type: "function" });
      } else if (word[0] === word[0].toUpperCase() && /^[A-Z]/.test(word)) {
        tokens.push({ text: word, type: "type" });
      } else {
        tokens.push({ text: word, type: "text" });
      }
      i = j;
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:;,.]/.test(line[i])) {
      tokens.push({ text: line[i], type: "operator" });
      i++;
      continue;
    }

    // HTML tags
    if (lang === "html" && (line[i] === "<" || line[i] === ">")) {
      tokens.push({ text: line[i], type: "keyword" });
      i++;
      continue;
    }

    // Brackets and other chars
    tokens.push({ text: line[i], type: "text" });
    i++;
  }

  return tokens;
}

// ── Canvas rendering ──

function getBackgroundFill(
  ctx: CanvasRenderingContext2D,
  bg: BackgroundStyle,
  w: number,
  h: number,
): string | CanvasGradient {
  switch (bg) {
    case "gradient-purple": {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#667eea");
      g.addColorStop(1, "#764ba2");
      return g;
    }
    case "gradient-blue": {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#2193b0");
      g.addColorStop(1, "#6dd5ed");
      return g;
    }
    case "gradient-green": {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#11998e");
      g.addColorStop(1, "#38ef7d");
      return g;
    }
    case "gradient-orange": {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#f093fb");
      g.addColorStop(1, "#f5576c");
      return g;
    }
    case "gradient-pink": {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#ee9ca7");
      g.addColorStop(1, "#ffdde1");
      return g;
    }
    case "gradient-dark": {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#0f0c29");
      g.addColorStop(0.5, "#302b63");
      g.addColorStop(1, "#24243e");
      return g;
    }
    case "solid-dark":
      return "#1a1a2e";
    case "solid-white":
      return "#f0f0f0";
    case "transparent":
      return "transparent";
  }
}

function renderToCanvas(
  canvas: HTMLCanvasElement,
  code: string,
  theme: Theme,
  lang: LanguageId,
  background: BackgroundStyle,
  padding: number,
  fontSize: number,
  showLineNumbers: boolean,
  showWindowChrome: boolean,
  title: string,
  scale: number = 2,
): void {
  const ctx = canvas.getContext("2d")!;
  const lineHeight = fontSize * 1.6;
  const fontFamily = '"Fira Code", "JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, "Courier New", monospace';

  const lines = code.split("\n");

  // Measure text width
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  const lineNumWidth = showLineNumbers
    ? ctx.measureText(String(lines.length)).width + 24 * scale
    : 0;

  let maxLineWidth = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > maxLineWidth) maxLineWidth = w;
  }

  const codePaddingX = 20 * scale;
  const codePaddingY = 16 * scale;
  const windowChromeHeight = showWindowChrome ? 40 * scale : 0;

  const codeBlockWidth =
    lineNumWidth + maxLineWidth + codePaddingX * 2 + 20 * scale;
  const codeBlockHeight =
    lines.length * lineHeight * scale +
    codePaddingY * 2 +
    windowChromeHeight;

  const canvasWidth = codeBlockWidth + padding * 2 * scale;
  const canvasHeight = codeBlockHeight + padding * 2 * scale;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Background
  if (background === "transparent") {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  } else {
    ctx.fillStyle = getBackgroundFill(ctx, background, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // Code block with rounded corners
  const blockX = padding * scale;
  const blockY = padding * scale;
  const blockW = codeBlockWidth;
  const blockH = codeBlockHeight;
  const radius = 12 * scale;

  ctx.beginPath();
  ctx.roundRect(blockX, blockY, blockW, blockH, radius);
  ctx.fillStyle = theme.bg;
  ctx.fill();

  // Border
  ctx.beginPath();
  ctx.roundRect(blockX, blockY, blockW, blockH, radius);
  ctx.strokeStyle = theme.windowBorder;
  ctx.lineWidth = 1 * scale;
  ctx.stroke();

  // Window chrome (traffic lights + title)
  if (showWindowChrome) {
    // Chrome background
    ctx.beginPath();
    ctx.roundRect(blockX, blockY, blockW, windowChromeHeight, [
      radius,
      radius,
      0,
      0,
    ]);
    ctx.fillStyle = theme.windowBg;
    ctx.fill();

    // Border below chrome
    ctx.beginPath();
    ctx.moveTo(blockX, blockY + windowChromeHeight);
    ctx.lineTo(blockX + blockW, blockY + windowChromeHeight);
    ctx.strokeStyle = theme.windowBorder;
    ctx.lineWidth = 1 * scale;
    ctx.stroke();

    // Traffic lights
    const dotY = blockY + windowChromeHeight / 2;
    const dotRadius = 6 * scale;
    const dotStartX = blockX + 20 * scale;
    const dotGap = 20 * scale;

    const colors = ["#ff5f57", "#febc2e", "#28c840"];
    for (let d = 0; d < 3; d++) {
      ctx.beginPath();
      ctx.arc(dotStartX + d * dotGap, dotY, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = colors[d];
      ctx.fill();
    }

    // Title
    if (title) {
      ctx.font = `${12 * scale}px ${fontFamily}`;
      ctx.fillStyle = theme.comment;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(title, blockX + blockW / 2, dotY);
      ctx.textAlign = "left";
    }
  }

  // Render code lines
  ctx.font = `${fontSize * scale}px ${fontFamily}`;
  ctx.textBaseline = "top";

  const codeStartX = blockX + codePaddingX + lineNumWidth;
  const codeStartY =
    blockY + windowChromeHeight + codePaddingY;

  for (let i = 0; i < lines.length; i++) {
    const y = codeStartY + i * lineHeight * scale;

    // Line numbers
    if (showLineNumbers) {
      ctx.fillStyle = theme.comment;
      ctx.textAlign = "right";
      ctx.fillText(
        String(i + 1),
        blockX + codePaddingX + lineNumWidth - 16 * scale,
        y,
      );
      ctx.textAlign = "left";
    }

    // Tokenize and render
    const tokens = tokenizeLine(lines[i], lang);
    let x = codeStartX;

    for (const token of tokens) {
      switch (token.type) {
        case "keyword":
          ctx.fillStyle = theme.keyword;
          break;
        case "string":
          ctx.fillStyle = theme.string;
          break;
        case "comment":
          ctx.fillStyle = theme.comment;
          break;
        case "number":
          ctx.fillStyle = theme.number;
          break;
        case "function":
          ctx.fillStyle = theme.function;
          break;
        case "operator":
          ctx.fillStyle = theme.operator;
          break;
        case "type":
          ctx.fillStyle = theme.type;
          break;
        default:
          ctx.fillStyle = theme.text;
      }
      ctx.fillText(token.text, x, y);
      x += ctx.measureText(token.text).width;
    }
  }
}

// ── Component ──

export default function CodeScreenshotTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState("");
  const [themeId, setThemeId] = useState<ThemeId>("dracula");
  const [language, setLanguage] = useState<LanguageId>("javascript");
  const [background, setBackground] = useState<BackgroundStyle>("gradient-purple");
  const [padding, setPadding] = useState(48);
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showWindowChrome, setShowWindowChrome] = useState(true);
  const [title, setTitle] = useState("untitled.js");
  const [copied, setCopied] = useState(false);

  const { trackAction } = useToolAnalytics("code-screenshot");
  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("code-screenshot");

  const theme = THEMES.find((t) => t.id === themeId)!;

  // Re-render preview whenever settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const displayCode = code || SAMPLE_CODE;
    renderToCanvas(
      canvas,
      displayCode,
      theme,
      language,
      background,
      padding,
      fontSize,
      showLineNumbers,
      showWindowChrome,
      title,
    );
  }, [
    code,
    theme,
    language,
    background,
    padding,
    fontSize,
    showLineNumbers,
    showWindowChrome,
    title,
  ]);

  const handleDownload = useCallback(
    (format: "png" | "jpeg") => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (isLimited) return;
      recordUsage();
      trackAction("download");

      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const quality = format === "jpeg" ? 0.95 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const link = document.createElement("a");
      link.download = `code-screenshot.${format}`;
      link.href = dataUrl;
      link.click();
    },
    [isLimited, recordUsage, trackAction],
  );

  const handleCopyImage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (isLimited) return;
    recordUsage();
    trackAction("copy");

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {
      // Fallback: open in new tab
      const dataUrl = canvas.toDataURL("image/png");
      window.open(dataUrl, "_blank");
    }
  }, [isLimited, recordUsage, trackAction]);

  function handleLoadSample() {
    setCode(SAMPLE_CODE);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Code Screenshot Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Create beautiful screenshots of your code with customizable themes,
        backgrounds, and window chrome. A free Carbon/Ray.so alternative — all
        client-side.
      </p>

      <RateLimitBanner
        remaining={remaining}
        dailyLimit={dailyLimit}
        isLimited={isLimited}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left: Code input + preview */}
        <div className="space-y-4">
          {/* Code input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Code
              </label>
              <button
                onClick={handleLoadSample}
                className="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Load sample
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              rows={12}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-mono text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Preview
            </label>
            <div className="overflow-auto rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ imageRendering: "auto" }}
              />
            </div>
          </div>

          {/* Export buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleDownload("png")}
              disabled={isLimited}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownload("jpeg")}
              disabled={isLimited}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download JPEG
            </button>
            <button
              onClick={handleCopyImage}
              disabled={isLimited}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="space-y-5">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    themeId === t.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: t.bg }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageId)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Background */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Background
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id)}
                  className={`rounded-lg border p-1 transition-colors ${
                    background === bg.id
                      ? "border-indigo-500 ring-1 ring-indigo-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div
                    className="h-8 w-full rounded"
                    style={{ background: bg.preview }}
                  />
                  <span className="mt-1 block text-[10px] text-gray-500 dark:text-gray-400">
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Padding */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Padding: {padding}px
            </label>
            <div className="flex gap-2">
              {PADDING_OPTIONS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPadding(p)}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                    padding === p
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Font size: {fontSize}px
            </label>
            <div className="flex gap-2">
              {FONT_SIZE_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                    fontSize === s
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Window title */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Window Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="filename.js"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show line numbers
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showWindowChrome}
                onChange={(e) => setShowWindowChrome(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Show window chrome
            </label>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About Code Screenshot Generator
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            <strong>8 themes</strong> — Dracula, Monokai, GitHub Dark, One Dark,
            Nord, Solarized Dark, Night Owl, and GitHub Light.
          </li>
          <li>
            <strong>13 languages</strong> — syntax highlighting for JS, TS,
            Python, Go, Rust, Java, C#, HTML, CSS, JSON, Bash, SQL, and plain
            text.
          </li>
          <li>
            <strong>9 backgrounds</strong> — gradients, solid colors, or
            transparent for clean overlay.
          </li>
          <li>
            <strong>Customizable</strong> — padding, font size, window chrome,
            line numbers, and title bar.
          </li>
          <li>
            <strong>Export</strong> — download as PNG or JPEG, or copy directly
            to clipboard.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
