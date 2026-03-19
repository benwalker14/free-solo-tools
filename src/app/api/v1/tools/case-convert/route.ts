import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";

type CaseType =
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot"
  | "title"
  | "sentence"
  | "lower"
  | "upper";

function splitWords(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase boundaries
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // ABCDef → ABC Def
    .replace(/[_\-./]/g, " ") // separators to spaces
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function convertCase(input: string, target: CaseType): string {
  const words = splitWords(input);
  if (words.length === 0) return "";

  switch (target) {
    case "camel":
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join("");
    case "pascal":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");
    case "snake":
      return words.map((w) => w.toLowerCase()).join("_");
    case "kebab":
      return words.map((w) => w.toLowerCase()).join("-");
    case "constant":
      return words.map((w) => w.toUpperCase()).join("_");
    case "dot":
      return words.map((w) => w.toLowerCase()).join(".");
    case "title":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    case "sentence":
      return words
        .map((w, i) =>
          i === 0
            ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
            : w.toLowerCase()
        )
        .join(" ");
    case "lower":
      return words.map((w) => w.toLowerCase()).join(" ");
    case "upper":
      return words.map((w) => w.toUpperCase()).join(" ");
    default:
      return input;
  }
}

const VALID_CASES: CaseType[] = [
  "camel",
  "pascal",
  "snake",
  "kebab",
  "constant",
  "dot",
  "title",
  "sentence",
  "lower",
  "upper",
];

/**
 * POST /api/v1/tools/case-convert
 * Convert text between naming conventions.
 *
 * Body: { "input": "...", "to": "camel" | "pascal" | "snake" | "kebab" | "constant" | "dot" | "title" | "sentence" | "lower" | "upper" }
 * Omit "to" to get all conversions at once.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const { input, to } = await request.json();

    if (typeof input !== "string" || !input.trim()) {
      return NextResponse.json(
        { error: "Missing required field: input" },
        { status: 400 }
      );
    }

    if (to) {
      const target = String(to).toLowerCase() as CaseType;
      if (!VALID_CASES.includes(target)) {
        return NextResponse.json(
          { error: `Invalid case. Use: ${VALID_CASES.join(", ")}` },
          { status: 400 }
        );
      }
      return NextResponse.json({ result: convertCase(input, target) });
    }

    // Return all conversions
    const results: Record<string, string> = {};
    for (const c of VALID_CASES) {
      results[c] = convertCase(input, c);
    }
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Case conversion failed." },
      { status: 400 }
    );
  }
}
