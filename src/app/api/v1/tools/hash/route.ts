import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { authenticateApiKey } from "@/lib/api-auth";

const ALGORITHMS = ["sha1", "sha256", "sha384", "sha512", "md5"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

/**
 * POST /api/v1/tools/hash
 * Generate hash digests of input text.
 *
 * Body: { "input": "...", "algorithm": "sha256" | "sha1" | "sha384" | "sha512" | "md5", "encoding": "hex" | "base64" }
 * Omit algorithm to get all hashes at once.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const { input, algorithm, encoding = "hex" } = await request.json();

    if (typeof input !== "string") {
      return NextResponse.json(
        { error: "Missing required field: input" },
        { status: 400 }
      );
    }

    const enc = encoding === "base64" ? "base64" : "hex";

    if (algorithm) {
      const algo = String(algorithm).toLowerCase() as Algorithm;
      if (!ALGORITHMS.includes(algo)) {
        return NextResponse.json(
          { error: `Unsupported algorithm. Use: ${ALGORITHMS.join(", ")}` },
          { status: 400 }
        );
      }
      const hash = createHash(algo).update(input, "utf-8").digest(enc);
      return NextResponse.json({ algorithm: algo, hash });
    }

    // Return all hashes
    const hashes: Record<string, string> = {};
    for (const algo of ALGORITHMS) {
      hashes[algo] = createHash(algo).update(input, "utf-8").digest(enc);
    }
    return NextResponse.json({ hashes });
  } catch {
    return NextResponse.json(
      { error: "Hash generation failed." },
      { status: 400 }
    );
  }
}
