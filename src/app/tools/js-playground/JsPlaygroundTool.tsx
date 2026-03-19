"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface ConsoleEntry {
  type: "log" | "error" | "warn" | "info";
  content: string;
}

const SANDBOX_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
let tsCompiler=null;
async function loadTS(){
  if(tsCompiler)return tsCompiler;
  return new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/typescript@5.4.5/lib/typescript.min.js';
    s.onload=()=>{tsCompiler=window.ts;res(tsCompiler);};
    s.onerror=()=>rej(new Error('Failed to load TypeScript compiler'));
    document.head.appendChild(s);
  });
}
function fmt(v){
  if(v===null)return'null';
  if(v===undefined)return'undefined';
  if(typeof v==='function')return v.toString();
  if(typeof v==='symbol')return v.toString();
  if(v instanceof Error)return v.stack||v.message;
  if(typeof v==='object'){try{return JSON.stringify(v,null,2)}catch(e){return String(v)}}
  return String(v);
}
window.addEventListener('message',async(e)=>{
  if(!e.data||e.data.action!=='execute')return;
  const{code,language,runId}=e.data;
  const out=[];
  const sv={};
  ['log','error','warn','info','debug','dir'].forEach(m=>{
    sv[m]=console[m];
    console[m]=(...a)=>out.push({type:m==='debug'||m==='dir'?'log':m,content:a.map(fmt).join(' ')});
  });
  console.table=(d)=>out.push({type:'log',content:fmt(d)});
  console.clear=()=>{};
  const t0=performance.now();
  try{
    let js=code;
    if(language==='typescript'){
      const tsc=await loadTS();
      const r=tsc.transpileModule(code,{compilerOptions:{target:tsc.ScriptTarget.ES2020,module:tsc.ModuleKind.None,strict:false}});
      js=r.outputText;
    }
    const AF=Object.getPrototypeOf(async function(){}).constructor;
    await new AF(js)();
    const dt=performance.now()-t0;
    Object.keys(sv).forEach(m=>console[m]=sv[m]);
    parent.postMessage({runId,output:out,time:dt},'*');
  }catch(err){
    const dt=performance.now()-t0;
    out.push({type:'error',content:err.stack||err.message||String(err)});
    Object.keys(sv).forEach(m=>console[m]=sv[m]);
    parent.postMessage({runId,output:out,time:dt},'*');
  }
});
parent.postMessage({type:'ready'},'*');
<\/script></body></html>`;

const DEFAULT_JS = `// Welcome to the JavaScript Playground!
// Edit this code and press Ctrl+Enter or click Run.

const greet = (name) => \`Hello, \${name}!\`;
console.log(greet("World"));

// Array methods
const numbers = [1, 2, 3, 4, 5];
console.log("Doubled:", numbers.map(n => n * 2));
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));

// Object destructuring
const { name, version } = { name: "DevBolt", version: "1.0" };
console.log(\`\${name} v\${version}\`);`;

const DEFAULT_TS = `// Welcome to the TypeScript Playground!
// Edit this code and press Ctrl+Enter or click Run.

interface User {
  name: string;
  age: number;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const user: User = { name: "Alice", age: 30, email: "alice@example.com" };
console.log(greet(user));

// Generics
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log("First number:", first([10, 20, 30]));
console.log("First word:", first(["hello", "world"]));`;

const EXAMPLES = [
  {
    name: "Array Methods",
    language: "javascript" as const,
    code: `const fruits = ["apple", "banana", "cherry", "date", "elderberry"];

// map — transform each element
console.log("Uppercase:", fruits.map(f => f.toUpperCase()));

// filter — keep elements that match
console.log("Long names:", fruits.filter(f => f.length > 5));

// find — first match
console.log("Starts with 'c':", fruits.find(f => f.startsWith("c")));

// reduce — accumulate into single value
const lengths = fruits.reduce((acc, f) => {
  acc[f] = f.length;
  return acc;
}, {});
console.log("Lengths:", lengths);

// some & every
console.log("Any short?", fruits.some(f => f.length <= 4));
console.log("All have vowels?", fruits.every(f => /[aeiou]/i.test(f)));`,
  },
  {
    name: "Async / Await",
    language: "javascript" as const,
    code: `// Simulated async operations
const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchUser(id) {
  await delay(100);
  return { id, name: "User " + id, active: id % 2 === 0 };
}

// Sequential
console.log("Fetching users sequentially...");
const user1 = await fetchUser(1);
const user2 = await fetchUser(2);
console.log("User 1:", user1);
console.log("User 2:", user2);

// Parallel with Promise.all
console.log("\\nFetching in parallel...");
const users = await Promise.all([3, 4, 5].map(fetchUser));
console.log("All users:", users);

// Error handling
try {
  await Promise.reject(new Error("Network failure"));
} catch (err) {
  console.error("Caught:", err.message);
}`,
  },
  {
    name: "Classes",
    language: "javascript" as const,
    code: `class Shape {
  constructor(name) {
    this.name = name;
  }

  area() {
    throw new Error("area() must be implemented");
  }

  describe() {
    console.log(\`\${this.name}: area = \${this.area().toFixed(2)}\`);
  }
}

class Circle extends Shape {
  constructor(radius) {
    super("Circle");
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(w, h) {
    super("Rectangle");
    this.w = w;
    this.h = h;
  }

  area() {
    return this.w * this.h;
  }
}

const shapes = [new Circle(5), new Rectangle(4, 6), new Circle(3)];
shapes.forEach(s => s.describe());

console.log("\\nTotal area:", shapes.reduce((sum, s) => sum + s.area(), 0).toFixed(2));`,
  },
  {
    name: "Closures & Currying",
    language: "javascript" as const,
    code: `// Closure — function remembers its scope
function counter(start = 0) {
  let count = start;
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const c = counter(10);
console.log(c.increment()); // 11
console.log(c.increment()); // 12
console.log(c.decrement()); // 11
console.log("Value:", c.value());

// Currying — function that returns functions
const multiply = (a) => (b) => a * b;
const double = multiply(2);
const triple = multiply(3);

console.log("\\nDouble 5:", double(5));
console.log("Triple 5:", triple(5));

// Practical: create validators
const minLength = (min) => (str) => str.length >= min;
const matches = (regex) => (str) => regex.test(str);

const isValidPassword = (pw) =>
  [minLength(8), matches(/[A-Z]/), matches(/[0-9]/)].every(fn => fn(pw));

console.log("\\n'Hello1' valid?", isValidPassword("Hello1"));
console.log("'SecurePass1' valid?", isValidPassword("SecurePass1"));`,
  },
  {
    name: "Promises",
    language: "javascript" as const,
    code: `// Creating promises
const coinFlip = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    Math.random() > 0.5 ? resolve("Heads!") : reject("Tails!");
  }, 50);
});

// Promise chaining
Promise.resolve(1)
  .then(n => { console.log("Step 1:", n); return n + 1; })
  .then(n => { console.log("Step 2:", n); return n * 3; })
  .then(n => console.log("Result:", n));

// Promise.allSettled — wait for all, even failures
const results = await Promise.allSettled([
  coinFlip(),
  coinFlip(),
  coinFlip(),
  Promise.resolve("Always works"),
]);

console.log("\\nAll settled:");
results.forEach((r, i) => {
  if (r.status === "fulfilled") {
    console.log(\`  #\${i + 1} ✓ \${r.value}\`);
  } else {
    console.log(\`  #\${i + 1} ✗ \${r.reason}\`);
  }
});`,
  },
  {
    name: "TypeScript Interfaces",
    language: "typescript" as const,
    code: `interface Product {
  id: number;
  name: string;
  price: number;
  category: "electronics" | "clothing" | "food";
  inStock: boolean;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999, category: "electronics", inStock: true },
  { id: 2, name: "T-Shirt", price: 29, category: "clothing", inStock: true },
  { id: 3, name: "Headphones", price: 149, category: "electronics", inStock: false },
  { id: 4, name: "Coffee", price: 12, category: "food", inStock: true },
];

// Type-safe filtering
function getByCategory(items: Product[], cat: Product["category"]): Product[] {
  return items.filter(p => p.category === cat);
}

console.log("Electronics:", getByCategory(products, "electronics"));

// Mapped type — make all fields optional
type PartialProduct = Partial<Product>;
const update: PartialProduct = { price: 899, inStock: false };
console.log("\\nPartial update:", update);

// Pick specific fields
type ProductSummary = Pick<Product, "name" | "price">;
const summaries: ProductSummary[] = products.map(({ name, price }) => ({ name, price }));
console.log("\\nSummaries:", summaries);`,
  },
  {
    name: "TypeScript Generics",
    language: "typescript" as const,
    code: `// Generic function
function wrapInArray<T>(value: T): T[] {
  return [value];
}

console.log(wrapInArray(42));
console.log(wrapInArray("hello"));

// Generic interface
interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}

console.log("\\nOk:", ok({ id: 1, name: "Alice" }));
console.log("Fail:", fail("Not found"));

// Generic constraint
interface HasLength {
  length: number;
}

function longest<T extends HasLength>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

console.log("\\nLongest string:", longest("hello", "hi"));
console.log("Longest array:", longest([1, 2, 3], [4, 5]));

// Generic class
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
  get size() { return this.items.length; }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log("\\nStack peek:", stack.peek(), "size:", stack.size);
console.log("Pop:", stack.pop(), "size:", stack.size);`,
  },
];

export default function JsPlaygroundTool() {
  const [code, setCode] = useState(DEFAULT_JS);
  const [language, setLanguage] = useState<"javascript" | "typescript">(
    "javascript"
  );
  const [output, setOutput] = useState<ConsoleEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [tsLoading, setTsLoading] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const runIdRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { trackFirstInteraction } = useToolAnalytics("js-playground");

  const createIframe = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.remove();
    }
    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts");
    iframe.style.display = "none";
    iframe.srcdoc = SANDBOX_HTML;
    document.body.appendChild(iframe);
    iframeRef.current = iframe;
  }, []);

  useEffect(() => {
    createIframe();

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.runId !== undefined && data.runId === runIdRef.current) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setOutput(data.output || []);
        setExecutionTime(data.time);
        setIsRunning(false);
        setTsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      if (iframeRef.current) {
        iframeRef.current.remove();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [createIframe]);

  const runCode = useCallback(() => {
    if (isRunning) return;

    trackFirstInteraction();
    setIsRunning(true);
    setOutput([]);
    setExecutionTime(null);
    if (language === "typescript") setTsLoading(true);

    const runId = ++runIdRef.current;

    iframeRef.current?.contentWindow?.postMessage(
      { action: "execute", code, language, runId },
      "*"
    );

    timeoutRef.current = setTimeout(() => {
      setOutput([
        {
          type: "error",
          content: "Execution timed out (10s limit). Possible infinite loop?",
        },
      ]);
      setIsRunning(false);
      setTsLoading(false);
      runIdRef.current++;
      createIframe();
    }, 10000);
  }, [code, language, isRunning, createIframe, trackFirstInteraction]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
        return;
      }

      // Tab inserts 2 spaces
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const newVal = val.substring(0, start) + "  " + val.substring(end);
        setCode(newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [runCode]
  );

  const switchLanguage = useCallback(
    (lang: "javascript" | "typescript") => {
      if (lang === language) return;
      const isDefault =
        code === DEFAULT_JS || code === DEFAULT_TS || code.trim() === "";
      setLanguage(lang);
      if (isDefault) {
        setCode(lang === "javascript" ? DEFAULT_JS : DEFAULT_TS);
      }
    },
    [language, code]
  );

  const loadExample = useCallback(
    (example: (typeof EXAMPLES)[number]) => {
      setCode(example.code);
      if (example.language !== language) {
        setLanguage(example.language);
      }
    },
    [language]
  );

  const lineCount = code.split("\n").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        JavaScript / TypeScript Playground
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Write and run JavaScript or TypeScript code directly in your browser.
        No setup required.
      </p>

      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {/* Language toggle */}
        <div className="flex rounded-lg border border-gray-300 dark:border-gray-700">
          <button
            onClick={() => switchLanguage("javascript")}
            className={`rounded-l-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              language === "javascript"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => switchLanguage("typescript")}
            className={`rounded-r-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              language === "typescript"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            TypeScript
          </button>
        </div>

        {/* Examples dropdown */}
        <div className="relative">
          <select
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              if (!isNaN(idx)) loadExample(EXAMPLES[idx]);
              e.target.value = "";
            }}
            defaultValue=""
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            <option value="" disabled>
              Load example...
            </option>
            {EXAMPLES.map((ex, i) => (
              <option key={i} value={i}>
                {ex.name} ({ex.language === "typescript" ? "TS" : "JS"})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        {/* Run button */}
        <button
          onClick={runCode}
          disabled={isRunning}
          className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
        >
          {isRunning ? (
            tsLoading ? (
              "Loading TypeScript..."
            ) : (
              "Running..."
            )
          ) : (
            <>
              <span>&#9654;</span> Run
            </>
          )}
        </button>

        <button
          onClick={() => {
            setOutput([]);
            setExecutionTime(null);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Clear Console
        </button>
      </div>

      {/* Code editor */}
      <div className="relative mb-4 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
        <div className="flex bg-gray-50 dark:bg-gray-950">
          {/* Line numbers */}
          <div
            className="select-none border-r border-gray-200 bg-gray-100 px-3 py-3 text-right font-mono text-xs leading-[1.625rem] text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              trackFirstInteraction();
              setCode(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="w-full resize-y bg-gray-50 px-4 py-3 font-mono text-sm leading-[1.625rem] text-gray-900 placeholder-gray-400 focus:outline-none dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-600"
            rows={16}
            placeholder="Write your code here..."
          />
        </div>

        {/* Keyboard hint */}
        <div className="border-t border-gray-200 bg-gray-100 px-3 py-1 text-right text-xs text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
          Ctrl+Enter to run &middot; Tab inserts spaces
        </div>
      </div>

      {/* Console output */}
      <div>
        <div className="mb-2 flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Console Output
          </h3>
          {executionTime !== null && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {executionTime < 1
                ? `${executionTime.toFixed(2)}ms`
                : executionTime < 1000
                  ? `${executionTime.toFixed(1)}ms`
                  : `${(executionTime / 1000).toFixed(2)}s`}
            </span>
          )}
        </div>

        <div className="max-h-80 overflow-auto rounded-lg border border-gray-300 bg-gray-950 dark:border-gray-700">
          {output.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              {isRunning
                ? "Running..."
                : "Click Run or press Ctrl+Enter to execute your code"}
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {output.map((entry, i) => (
                <div
                  key={i}
                  className={`flex gap-2 px-4 py-1.5 font-mono text-sm ${
                    entry.type === "error"
                      ? "bg-red-950/40 text-red-400"
                      : entry.type === "warn"
                        ? "bg-yellow-950/30 text-yellow-400"
                        : entry.type === "info"
                          ? "text-blue-400"
                          : "text-gray-200"
                  }`}
                >
                  <span
                    className={`select-none ${
                      entry.type === "error"
                        ? "text-red-600"
                        : entry.type === "warn"
                          ? "text-yellow-600"
                          : "text-gray-600"
                    }`}
                  >
                    {entry.type === "error"
                      ? "✕"
                      : entry.type === "warn"
                        ? "⚠"
                        : "›"}
                  </span>
                  <pre className="flex-1 whitespace-pre-wrap break-words">
                    {entry.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
