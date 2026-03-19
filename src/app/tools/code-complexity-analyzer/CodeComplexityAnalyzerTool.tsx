"use client";

import { useState, useCallback, useMemo } from "react";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import RateLimitBanner from "@/components/RateLimitBanner";

// ─── Types ──────────────────────────────────────────────────────────────────

type RiskLevel = "low" | "moderate" | "high" | "very-high";

interface FunctionMetric {
  name: string;
  type: string; // "function", "arrow", "method", "class method"
  startLine: number;
  endLine: number;
  loc: number;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  maxNestingDepth: number;
  paramCount: number;
  risk: RiskLevel;
}

interface AnalysisResult {
  functions: FunctionMetric[];
  overall: {
    totalLines: number;
    codeLines: number;
    functionCount: number;
    avgCyclomatic: number;
    avgCognitive: number;
    maxCyclomatic: number;
    maxCognitive: number;
    maxNesting: number;
    maintainabilityIndex: number;
  };
  grade: string;
}

// ─── Analysis Engine ────────────────────────────────────────────────────────

/**
 * Find the matching closing brace for an opening brace at position `start`.
 * Handles string literals (single, double, template), comments, and regex.
 */
function findMatchingBrace(code: string, start: number): number {
  let depth = 0;
  let i = start;
  while (i < code.length) {
    const ch = code[i];

    // Skip string literals
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      while (i < code.length) {
        if (code[i] === "\\" && quote !== "`") {
          i += 2;
          continue;
        }
        if (code[i] === quote) break;
        if (quote === "`" && code[i] === "\\" ) {
          i += 2;
          continue;
        }
        i++;
      }
      i++;
      continue;
    }

    // Skip line comments
    if (ch === "/" && code[i + 1] === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }

    // Skip block comments
    if (ch === "/" && code[i + 1] === "*") {
      i += 2;
      while (i < code.length - 1 && !(code[i] === "*" && code[i + 1] === "/"))
        i++;
      i += 2;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
    i++;
  }
  return code.length - 1;
}

/**
 * Extract functions from JS/TS code with their bodies and line ranges.
 */
function extractFunctions(
  code: string,
): { name: string; type: string; body: string; startLine: number; endLine: number; paramCount: number }[] {
  const functions: {
    name: string;
    type: string;
    body: string;
    startLine: number;
    endLine: number;
    paramCount: number;
  }[] = [];

  const lines = code.split("\n");

  // Patterns to match function declarations and expressions
  const patterns = [
    // function declarations: function name(...) {
    {
      regex:
        /(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+(\w+)\s*(<[^>]*>)?\s*\(([^)]*)\)/g,
      type: "function",
    },
    // class methods: name(...) { or async name(...) {
    {
      regex:
        /(?:(?:public|private|protected|static|async|get|set)\s+)*(\w+)\s*(<[^>]*>)?\s*\(([^)]*)\)\s*(?::\s*[^{]+?)?\s*\{/g,
      type: "method",
    },
    // arrow functions assigned: const name = (...) => {
    {
      regex:
        /(?:const|let|var)\s+(\w+)\s*(?::\s*[^=]+?)?\s*=\s*(?:async\s+)?(?:<[^>]*>\s*)?\(([^)]*)\)\s*(?::\s*[^=>{]+?)?\s*=>\s*\{/g,
      type: "arrow",
    },
    // arrow functions assigned (single param): const name = param => {
    {
      regex:
        /(?:const|let|var)\s+(\w+)\s*(?::\s*[^=]+?)?\s*=\s*(?:async\s+)?\s*(\w+)\s*=>\s*\{/g,
      type: "arrow",
    },
  ];

  // Track which ranges we've already processed to avoid duplicates
  const processedRanges: { start: number; end: number }[] = [];

  function overlaps(start: number, end: number): boolean {
    return processedRanges.some(
      (r) =>
        (start >= r.start && start <= r.end) ||
        (end >= r.start && end <= r.end) ||
        (start <= r.start && end >= r.end),
    );
  }

  for (const pat of patterns) {
    const regex = new RegExp(pat.regex.source, pat.regex.flags);
    let match;
    while ((match = regex.exec(code)) !== null) {
      const matchEnd = match.index + match[0].length;

      // Find the opening brace
      let bracePos = code.indexOf("{", matchEnd - 1);
      if (bracePos === -1) continue;

      // For method pattern, the brace is already part of the match
      if (pat.type === "method") {
        bracePos = code.lastIndexOf("{", matchEnd);
        if (bracePos === -1) bracePos = code.indexOf("{", match.index);
      }

      if (bracePos === -1) continue;

      const closePos = findMatchingBrace(code, bracePos);
      if (overlaps(match.index, closePos)) continue;

      processedRanges.push({ start: match.index, end: closePos });

      const body = code.slice(bracePos, closePos + 1);
      const startLine =
        code.slice(0, match.index).split("\n").length;
      const endLine = code.slice(0, closePos + 1).split("\n").length;

      let name: string;
      let paramStr: string;

      if (pat.type === "arrow" && match[2] && !match[2].includes(",") && !match[2].includes("(")) {
        // Single-param arrow: const name = param => {
        name = match[1];
        paramStr = match[2];
      } else {
        name = match[1];
        paramStr = pat.type === "function" ? match[3] : (match[3] || match[2] || "");
      }

      // Skip constructor, common non-function matches
      if (name === "if" || name === "for" || name === "while" || name === "switch" || name === "catch" || name === "else") continue;

      const paramCount = paramStr.trim()
        ? paramStr.split(",").filter((p: string) => p.trim()).length
        : 0;

      functions.push({
        name,
        type: pat.type,
        body,
        startLine,
        endLine,
        paramCount,
      });
    }
  }

  // Sort by start line and deduplicate overlapping ranges
  functions.sort((a, b) => a.startLine - b.startLine);

  // If no functions found, treat the entire code as one block
  if (functions.length === 0 && code.trim().length > 0) {
    functions.push({
      name: "(top-level code)",
      type: "script",
      body: code,
      startLine: 1,
      endLine: lines.length,
      paramCount: 0,
    });
  }

  return functions;
}

/**
 * Calculate cyclomatic complexity (McCabe) for a code block.
 * CC = 1 + number of decision points.
 */
function calculateCyclomatic(body: string): number {
  let cc = 1;

  // Remove strings and comments to avoid false positives
  const cleaned = body
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/'(?:[^'\\]|\\.)*'/g, '""')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '""');

  // Decision point patterns
  const decisionPatterns = [
    /\bif\s*\(/g,
    /\belse\s+if\s*\(/g,
    /\bcase\s+/g,
    /\bwhile\s*\(/g,
    /\bfor\s*\(/g,
    /\bdo\s*\{/g,
    /\bcatch\s*\(/g,
    /\?\s*(?![.?])/g, // Ternary (but not ?. or ??)
    /&&/g,
    /\|\|/g,
    /\?\?/g,
  ];

  for (const pattern of decisionPatterns) {
    const matches = cleaned.match(pattern);
    if (matches) cc += matches.length;
  }

  // Subtract double-counted else if (counted as both if and else if)
  const elseIfMatches = cleaned.match(/\belse\s+if\s*\(/g);
  if (elseIfMatches) cc -= elseIfMatches.length;

  return cc;
}

/**
 * Calculate cognitive complexity for a code block.
 * Increments for breaks in linear flow + nesting penalties.
 */
function calculateCognitive(body: string): number {
  let cognitive = 0;

  const cleaned = body
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/'(?:[^'\\]|\\.)*'/g, '""')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '""');

  const lines = cleaned.split("\n");
  let nestingLevel = 0;

  // Track brace depth relative to function body
  let braceDepth = 0;
  let isFirstBrace = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Count braces for nesting level
    for (const ch of trimmed) {
      if (ch === "{") {
        if (isFirstBrace) {
          isFirstBrace = false;
        } else {
          braceDepth++;
        }
      }
      if (ch === "}") {
        if (braceDepth > 0) braceDepth--;
      }
    }

    // Structural increment (breaks in linear flow)
    if (/\bif\s*\(/.test(trimmed) && !/\belse\s+if/.test(trimmed)) {
      cognitive += 1 + nestingLevel;
      nestingLevel++;
    } else if (/\belse\s+if\s*\(/.test(trimmed)) {
      cognitive += 1; // No nesting penalty for else if
    } else if (/\belse\s*\{/.test(trimmed)) {
      cognitive += 1; // No nesting penalty for else
    } else if (/\bfor\s*\(/.test(trimmed) || /\bfor\s+/.test(trimmed)) {
      cognitive += 1 + nestingLevel;
      nestingLevel++;
    } else if (/\bwhile\s*\(/.test(trimmed)) {
      cognitive += 1 + nestingLevel;
      nestingLevel++;
    } else if (/\bdo\s*\{/.test(trimmed)) {
      cognitive += 1 + nestingLevel;
      nestingLevel++;
    } else if (/\bswitch\s*\(/.test(trimmed)) {
      cognitive += 1 + nestingLevel;
      nestingLevel++;
    } else if (/\bcatch\s*\(/.test(trimmed)) {
      cognitive += 1 + nestingLevel;
      nestingLevel++;
    }

    // Hybrid increment (logical operators add to complexity but no nesting)
    const andOr = trimmed.match(/&&|\|\|/g);
    if (andOr) cognitive += andOr.length;

    // Ternary
    const ternary = trimmed.match(/\?\s*(?![.?])/g);
    if (ternary) cognitive += ternary.length;

    // Recursion (calling own function name) — we'll skip this for simplicity

    // Track nesting decrease
    if (trimmed === "}") {
      if (nestingLevel > 0) nestingLevel--;
    }
  }

  return cognitive;
}

/**
 * Calculate maximum nesting depth in a code block.
 */
function calculateMaxNesting(body: string): number {
  const cleaned = body
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/'(?:[^'\\]|\\.)*'/g, '""')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '""');

  let maxDepth = 0;
  let depth = -1; // Start at -1 because the function's own braces don't count

  for (const ch of cleaned) {
    if (ch === "{") {
      depth++;
      if (depth > maxDepth) maxDepth = depth;
    }
    if (ch === "}") {
      depth--;
    }
  }

  return Math.max(0, maxDepth);
}

/**
 * Count lines of code (excluding blank lines and comment-only lines).
 */
function countCodeLines(body: string): number {
  return body
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (trimmed.startsWith("//")) return false;
      if (trimmed === "/*" || trimmed === "*/") return false;
      if (trimmed.startsWith("*")) return false;
      return true;
    }).length;
}

/**
 * Determine risk level from cyclomatic complexity.
 */
function assessRisk(cc: number, cognitive: number, nesting: number): RiskLevel {
  if (cc > 20 || cognitive > 25 || nesting > 6) return "very-high";
  if (cc > 10 || cognitive > 15 || nesting > 4) return "high";
  if (cc > 5 || cognitive > 8 || nesting > 3) return "moderate";
  return "low";
}

/**
 * Calculate a simplified Maintainability Index (0-100).
 * Based on the Microsoft Visual Studio formula.
 */
function calculateMaintainabilityIndex(
  avgCc: number,
  avgLoc: number,
): number {
  if (avgLoc === 0) return 100;
  // MI = max(0, (171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(LOC)) * 100/171)
  // Simplified: use LOC as a proxy for Halstead Volume
  const hv = Math.max(1, avgLoc * 5); // rough proxy
  const raw =
    171 - 5.2 * Math.log(hv) - 0.23 * avgCc - 16.2 * Math.log(avgLoc);
  return Math.round(Math.max(0, Math.min(100, (raw * 100) / 171)));
}

/**
 * Assign a letter grade based on maintainability index.
 */
function assignGrade(mi: number, maxCc: number): string {
  if (maxCc > 25) return "F";
  if (mi >= 80) return "A";
  if (mi >= 60) return "B";
  if (mi >= 40) return "C";
  if (mi >= 20) return "D";
  return "F";
}

/**
 * Main analysis function.
 */
function analyzeCode(code: string): AnalysisResult {
  const extracted = extractFunctions(code);
  const totalLines = code.split("\n").length;
  const codeLines = countCodeLines(code);

  const functions: FunctionMetric[] = extracted.map((fn) => {
    const loc = countCodeLines(fn.body);
    const cc = calculateCyclomatic(fn.body);
    const cog = calculateCognitive(fn.body);
    const nesting = calculateMaxNesting(fn.body);

    return {
      name: fn.name,
      type: fn.type,
      startLine: fn.startLine,
      endLine: fn.endLine,
      loc,
      cyclomaticComplexity: cc,
      cognitiveComplexity: cog,
      maxNestingDepth: nesting,
      paramCount: fn.paramCount,
      risk: assessRisk(cc, cog, nesting),
    };
  });

  const avgCc =
    functions.length > 0
      ? functions.reduce((sum, f) => sum + f.cyclomaticComplexity, 0) /
        functions.length
      : 0;
  const avgCog =
    functions.length > 0
      ? functions.reduce((sum, f) => sum + f.cognitiveComplexity, 0) /
        functions.length
      : 0;
  const maxCc = functions.length > 0
    ? Math.max(...functions.map((f) => f.cyclomaticComplexity))
    : 0;
  const maxCog = functions.length > 0
    ? Math.max(...functions.map((f) => f.cognitiveComplexity))
    : 0;
  const maxNesting = functions.length > 0
    ? Math.max(...functions.map((f) => f.maxNestingDepth))
    : 0;
  const avgLoc =
    functions.length > 0
      ? functions.reduce((sum, f) => sum + f.loc, 0) / functions.length
      : codeLines;

  const mi = calculateMaintainabilityIndex(avgCc, avgLoc);
  const grade = assignGrade(mi, maxCc);

  return {
    functions,
    overall: {
      totalLines,
      codeLines,
      functionCount: functions.length,
      avgCyclomatic: Math.round(avgCc * 10) / 10,
      avgCognitive: Math.round(avgCog * 10) / 10,
      maxCyclomatic: maxCc,
      maxCognitive: maxCog,
      maxNesting,
      maintainabilityIndex: mi,
    },
    grade,
  };
}

// ─── Sample Code ────────────────────────────────────────────────────────────

const SAMPLES: { name: string; code: string }[] = [
  {
    name: "Clean Code",
    code: `// Simple, well-structured functions
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getDiscountedPrice(price, discountPercent) {
  const discount = price * (discountPercent / 100);
  return price - discount;
}

function isValidEmail(email) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}`,
  },
  {
    name: "Complex Handler",
    code: `// API handler with moderate complexity
async function handleRequest(req, res) {
  const { method, path, body, headers } = req;
  const token = headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await verifyToken(token);
  if (!user || !user.active) {
    return res.status(403).json({ error: "Forbidden" });
  }

  switch (method) {
    case "GET":
      if (path.includes("/users")) {
        const users = await db.users.findMany();
        return res.json(users);
      } else if (path.includes("/posts")) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const posts = await db.posts.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: user.role === "admin" ? {} : { authorId: user.id },
        });
        return res.json(posts);
      }
      return res.status(404).json({ error: "Not found" });

    case "POST":
      if (!body || !body.title) {
        return res.status(400).json({ error: "Title required" });
      }
      if (body.title.length > 200) {
        return res.status(400).json({ error: "Title too long" });
      }
      const post = await db.posts.create({
        data: { ...body, authorId: user.id },
      });
      return res.status(201).json(post);

    case "DELETE":
      if (user.role !== "admin" && user.role !== "moderator") {
        return res.status(403).json({ error: "Not allowed" });
      }
      await db.posts.delete({ where: { id: req.query.id } });
      return res.status(204).end();

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}`,
  },
  {
    name: "Deeply Nested",
    code: `// Anti-pattern: deeply nested logic
function processData(data, options) {
  const results = [];

  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === "user") {
        if (data[i].active) {
          if (data[i].age >= 18) {
            if (options.includeAddress) {
              if (data[i].address) {
                if (data[i].address.country === "US") {
                  if (data[i].address.state) {
                    results.push({
                      name: data[i].name,
                      state: data[i].address.state,
                      verified: true,
                    });
                  }
                }
              }
            } else {
              results.push({
                name: data[i].name,
                verified: true,
              });
            }
          }
        }
      } else if (data[i].type === "organization") {
        if (data[i].members && data[i].members.length > 0) {
          for (let j = 0; j < data[i].members.length; j++) {
            if (data[i].members[j].role === "admin") {
              if (data[i].members[j].active) {
                results.push({
                  name: data[i].members[j].name,
                  org: data[i].name,
                  role: "admin",
                });
              }
            }
          }
        }
      }
    }
  }

  return results;
}`,
  },
  {
    name: "AI-Generated CRUD",
    code: `// Typical AI-generated code with quality issues
const validateAndProcessOrder = async (orderData, userId, options) => {
  let result = { success: false, errors: [] };

  // Validation
  if (!orderData) {
    result.errors.push("Order data is required");
    return result;
  }

  if (!orderData.items || orderData.items.length === 0) {
    result.errors.push("Order must have items");
    return result;
  }

  if (!userId) {
    result.errors.push("User ID is required");
    return result;
  }

  // Check user exists and has permission
  const user = await getUser(userId);
  if (!user) {
    result.errors.push("User not found");
    return result;
  }

  if (user.status === "suspended" || user.status === "banned") {
    result.errors.push("User account is not active");
    return result;
  }

  // Process each item
  let totalPrice = 0;
  const processedItems = [];

  for (const item of orderData.items) {
    if (!item.productId || !item.quantity) {
      result.errors.push("Each item needs productId and quantity");
      continue;
    }

    const product = await getProduct(item.productId);
    if (!product) {
      result.errors.push("Product " + item.productId + " not found");
      continue;
    }

    if (product.stock < item.quantity) {
      result.errors.push("Insufficient stock for " + product.name);
      continue;
    }

    const itemPrice = product.price * item.quantity;
    if (options && options.applyDiscount && user.tier === "premium") {
      const discount = options.discountPercent || 10;
      totalPrice += itemPrice * (1 - discount / 100);
    } else if (options && options.applyDiscount && user.tier === "gold") {
      totalPrice += itemPrice * 0.95;
    } else {
      totalPrice += itemPrice;
    }

    processedItems.push({
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal: itemPrice,
    });
  }

  if (processedItems.length === 0) {
    result.errors.push("No valid items to process");
    return result;
  }

  // Apply shipping
  if (totalPrice < 50 && options?.shipping !== "free") {
    totalPrice += 9.99;
  } else if (totalPrice >= 50 && totalPrice < 100) {
    totalPrice += 4.99;
  }

  // Apply tax
  if (user.address?.state) {
    const taxRate = getTaxRate(user.address.state);
    totalPrice *= 1 + taxRate;
  }

  // Check payment method
  if (orderData.paymentMethod === "credit_card") {
    if (!orderData.cardToken) {
      result.errors.push("Card token required for credit card payment");
      return result;
    }
    const paymentResult = await processPayment(orderData.cardToken, totalPrice);
    if (!paymentResult.success) {
      result.errors.push("Payment failed: " + paymentResult.message);
      return result;
    }
  } else if (orderData.paymentMethod === "paypal") {
    const paypalResult = await processPaypal(userId, totalPrice);
    if (!paypalResult.success) {
      result.errors.push("PayPal payment failed");
      return result;
    }
  }

  // Create order
  try {
    const order = await createOrder({
      userId,
      items: processedItems,
      total: Math.round(totalPrice * 100) / 100,
      status: "confirmed",
    });
    result.success = true;
    result.orderId = order.id;
  } catch (err) {
    result.errors.push("Failed to create order: " + err.message);
  }

  return result;
};`,
  },
];

// ─── Styles ─────────────────────────────────────────────────────────────────

const RISK_STYLES: Record<
  RiskLevel,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  low: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    label: "Low Risk",
  },
  moderate: {
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-800",
    dot: "bg-yellow-500",
    label: "Moderate",
  },
  high: {
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
    dot: "bg-orange-500",
    label: "High Risk",
  },
  "very-high": {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500",
    label: "Very High",
  },
};

const GRADE_STYLES: Record<string, string> = {
  A: "text-emerald-600 dark:text-emerald-400",
  B: "text-lime-600 dark:text-lime-400",
  C: "text-yellow-600 dark:text-yellow-400",
  D: "text-orange-600 dark:text-orange-400",
  F: "text-red-600 dark:text-red-400",
};

const METRIC_THRESHOLDS = {
  cyclomatic: { low: 5, moderate: 10, high: 20 },
  cognitive: { low: 8, moderate: 15, high: 25 },
  nesting: { low: 3, moderate: 4, high: 6 },
};

function getMetricColor(value: number, thresholds: { low: number; moderate: number; high: number }): string {
  if (value <= thresholds.low) return "text-emerald-600 dark:text-emerald-400";
  if (value <= thresholds.moderate) return "text-yellow-600 dark:text-yellow-400";
  if (value <= thresholds.high) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CodeComplexityAnalyzerTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [expandedFunctions, setExpandedFunctions] = useState<Set<string>>(
    new Set(),
  );
  const [sortBy, setSortBy] = useState<"line" | "cyclomatic" | "cognitive" | "nesting">("line");

  const { trackAction } = useToolAnalytics("code-complexity-analyzer");
  const { isLimited, remaining, dailyLimit, recordUsage } = useRateLimit(
    "code-complexity-analyzer",
  );

  const handleAnalyze = useCallback(() => {
    if (!input.trim() || isLimited) return;
    recordUsage();
    trackAction("analyze");
    const analysisResult = analyzeCode(input);
    setResult(analysisResult);
    // Auto-expand high/very-high risk functions
    const autoExpand = new Set<string>();
    for (const f of analysisResult.functions) {
      if (f.risk === "high" || f.risk === "very-high") {
        autoExpand.add(`${f.name}-${f.startLine}`);
      }
    }
    setExpandedFunctions(autoExpand);
  }, [input, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleAnalyze, { ctrl: true });

  const toggleFunction = useCallback((id: string) => {
    setExpandedFunctions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const sortedFunctions = useMemo(() => {
    if (!result) return [];
    const fns = [...result.functions];
    switch (sortBy) {
      case "cyclomatic":
        return fns.sort((a, b) => b.cyclomaticComplexity - a.cyclomaticComplexity);
      case "cognitive":
        return fns.sort((a, b) => b.cognitiveComplexity - a.cognitiveComplexity);
      case "nesting":
        return fns.sort((a, b) => b.maxNestingDepth - a.maxNestingDepth);
      default:
        return fns.sort((a, b) => a.startLine - b.startLine);
    }
  }, [result, sortBy]);

  const handleSample = useCallback((sample: (typeof SAMPLES)[0]) => {
    setInput(sample.code);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setInput("");
    setResult(null);
    setSortBy("line");
  }, []);

  const riskCounts = useMemo(() => {
    if (!result) return { low: 0, moderate: 0, high: 0, "very-high": 0 };
    const counts = { low: 0, moderate: 0, high: 0, "very-high": 0 };
    for (const f of result.functions) counts[f.risk]++;
    return counts;
  }, [result]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Code Complexity Analyzer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Paste JavaScript or TypeScript code to analyze cyclomatic complexity,
          cognitive complexity, nesting depth, and maintainability index per
          function.{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            100% client-side — your code never leaves your browser.
          </span>
        </p>
      </div>

      <RateLimitBanner
        isLimited={isLimited}
        remaining={remaining}
        dailyLimit={dailyLimit}
      />

      {/* Sample buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
          Samples:
        </span>
        {SAMPLES.map((s) => (
          <button
            key={s.name}
            onClick={() => handleSample(s)}
            className="rounded-md border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your JavaScript or TypeScript code here..."
          rows={14}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-4 font-mono text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
          spellCheck={false}
        />
      </div>

      {/* Actions */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={!input.trim() || isLimited}
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Analyze Complexity
        </button>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Clear
        </button>
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          Ctrl+Enter to analyze
        </span>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary card */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analysis Results
              </h2>
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Maintainability
                </div>
                <div
                  className={`text-4xl font-black ${GRADE_STYLES[result.grade] || ""}`}
                >
                  {result.grade}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {result.overall.functionCount}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Functions
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {result.overall.codeLines}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Code Lines
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
                <div
                  className={`text-2xl font-bold ${getMetricColor(result.overall.maxCyclomatic, METRIC_THRESHOLDS.cyclomatic)}`}
                >
                  {result.overall.avgCyclomatic}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Cyclomatic
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {result.overall.maintainabilityIndex}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Maintainability
                </div>
              </div>
            </div>

            {/* Risk distribution */}
            <div className="grid grid-cols-4 gap-2">
              {(["low", "moderate", "high", "very-high"] as const).map(
                (risk) => (
                  <div
                    key={risk}
                    className={`rounded-lg ${RISK_STYLES[risk].bg} p-2 text-center`}
                  >
                    <div
                      className={`text-lg font-bold ${RISK_STYLES[risk].text}`}
                    >
                      {riskCounts[risk]}
                    </div>
                    <div className={`text-[10px] ${RISK_STYLES[risk].text}`}>
                      {RISK_STYLES[risk].label}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Sort controls */}
          {result.functions.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Sort by:
              </span>
              <div className="flex gap-1.5">
                {(
                  [
                    { key: "line", label: "Line" },
                    { key: "cyclomatic", label: "Cyclomatic" },
                    { key: "cognitive", label: "Cognitive" },
                    { key: "nesting", label: "Nesting" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSortBy(opt.key)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      sortBy === opt.key
                        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Per-function results */}
          <div className="space-y-3">
            {sortedFunctions.map((fn) => {
              const style = RISK_STYLES[fn.risk];
              const fnId = `${fn.name}-${fn.startLine}`;
              const isExpanded = expandedFunctions.has(fnId);

              return (
                <div
                  key={fnId}
                  className={`rounded-lg border ${style.border} overflow-hidden`}
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleFunction(fnId)}
                    className={`w-full flex items-start gap-3 p-4 text-left ${style.bg} hover:opacity-90 transition-opacity`}
                  >
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${style.dot} flex-shrink-0`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold ${style.text}`}
                        >
                          {fn.name}()
                        </span>
                        <span className="rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] text-gray-600 dark:text-gray-400">
                          {fn.type}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Lines {fn.startLine}–{fn.endLine}
                        </span>
                      </div>
                      {/* Inline metrics */}
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs">
                        <span className={getMetricColor(fn.cyclomaticComplexity, METRIC_THRESHOLDS.cyclomatic)}>
                          CC: {fn.cyclomaticComplexity}
                        </span>
                        <span className={getMetricColor(fn.cognitiveComplexity, METRIC_THRESHOLDS.cognitive)}>
                          Cog: {fn.cognitiveComplexity}
                        </span>
                        <span className={getMetricColor(fn.maxNestingDepth, METRIC_THRESHOLDS.nesting)}>
                          Depth: {fn.maxNestingDepth}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          LOC: {fn.loc}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Params: {fn.paramCount}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-400 dark:text-gray-500 flex-shrink-0 text-sm">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-white dark:bg-gray-900">
                      {/* Metrics detail */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Cyclomatic Complexity
                          </div>
                          <div className={`text-xl font-bold ${getMetricColor(fn.cyclomaticComplexity, METRIC_THRESHOLDS.cyclomatic)}`}>
                            {fn.cyclomaticComplexity}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {fn.cyclomaticComplexity <= 5
                              ? "Simple, easy to test"
                              : fn.cyclomaticComplexity <= 10
                                ? "Moderate, consider splitting"
                                : fn.cyclomaticComplexity <= 20
                                  ? "Complex, hard to test"
                                  : "Very complex, refactor needed"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Cognitive Complexity
                          </div>
                          <div className={`text-xl font-bold ${getMetricColor(fn.cognitiveComplexity, METRIC_THRESHOLDS.cognitive)}`}>
                            {fn.cognitiveComplexity}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {fn.cognitiveComplexity <= 8
                              ? "Easy to understand"
                              : fn.cognitiveComplexity <= 15
                                ? "Needs attention"
                                : fn.cognitiveComplexity <= 25
                                  ? "Difficult to follow"
                                  : "Extremely hard to understand"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Max Nesting Depth
                          </div>
                          <div className={`text-xl font-bold ${getMetricColor(fn.maxNestingDepth, METRIC_THRESHOLDS.nesting)}`}>
                            {fn.maxNestingDepth}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {fn.maxNestingDepth <= 3
                              ? "Manageable nesting"
                              : fn.maxNestingDepth <= 4
                                ? "Getting deep, use early returns"
                                : "Too deep, flatten logic"}
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {fn.risk !== "low" && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Recommendations
                          </div>
                          <ul className="space-y-1.5">
                            {fn.cyclomaticComplexity > 10 && (
                              <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                Break this function into smaller, single-purpose functions. Each branch path should be independently testable.
                              </li>
                            )}
                            {fn.maxNestingDepth > 3 && (
                              <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                Reduce nesting with guard clauses (early returns), extract nested blocks into helper functions, or use optional chaining.
                              </li>
                            )}
                            {fn.cognitiveComplexity > 15 && (
                              <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                High cognitive complexity makes code hard to review. Simplify conditional logic, extract complex expressions into named variables, and favor switch over if-else chains.
                              </li>
                            )}
                            {fn.paramCount > 3 && (
                              <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                Consider using an options object instead of {fn.paramCount} individual parameters.
                              </li>
                            )}
                            {fn.loc > 50 && (
                              <li className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">•</span>
                                At {fn.loc} lines, this function is quite long. Extract logical sections into well-named helper functions.
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Metrics reference */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Metrics Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">
                      Metric
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      Low
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-yellow-600 dark:text-yellow-400">
                      Moderate
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-orange-600 dark:text-orange-400">
                      High
                    </th>
                    <th className="text-center py-2 px-3 font-semibold text-red-600 dark:text-red-400">
                      Very High
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-400">
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 font-medium">
                      Cyclomatic (CC)
                    </td>
                    <td className="text-center py-2 px-3">1–5</td>
                    <td className="text-center py-2 px-3">6–10</td>
                    <td className="text-center py-2 px-3">11–20</td>
                    <td className="text-center py-2 px-3">&gt;20</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 pr-4 font-medium">
                      Cognitive
                    </td>
                    <td className="text-center py-2 px-3">1–8</td>
                    <td className="text-center py-2 px-3">9–15</td>
                    <td className="text-center py-2 px-3">16–25</td>
                    <td className="text-center py-2 px-3">&gt;25</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">
                      Nesting Depth
                    </td>
                    <td className="text-center py-2 px-3">1–3</td>
                    <td className="text-center py-2 px-3">4</td>
                    <td className="text-center py-2 px-3">5–6</td>
                    <td className="text-center py-2 px-3">&gt;6</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              This analyzer uses pattern-based static analysis to approximate
              cyclomatic complexity (McCabe), cognitive complexity (SonarSource),
              and maintainability index (Microsoft). Results are estimates — for
              production code, use dedicated tools like ESLint
              (complexity rule), SonarQube, or CodeClimate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
