"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";
import * as jose from "jose";

type Algorithm =
  | "HS256"
  | "HS384"
  | "HS512"
  | "RS256"
  | "RS384"
  | "RS512"
  | "ES256"
  | "ES384"
  | "ES512"
  | "none";

interface Claim {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
}

const ALGORITHMS: { value: Algorithm; label: string; group: string }[] = [
  { value: "HS256", label: "HS256", group: "HMAC" },
  { value: "HS384", label: "HS384", group: "HMAC" },
  { value: "HS512", label: "HS512", group: "HMAC" },
  { value: "RS256", label: "RS256", group: "RSA" },
  { value: "RS384", label: "RS384", group: "RSA" },
  { value: "RS512", label: "RS512", group: "RSA" },
  { value: "ES256", label: "ES256", group: "ECDSA" },
  { value: "ES384", label: "ES384", group: "ECDSA" },
  { value: "ES512", label: "ES512", group: "ECDSA" },
  { value: "none", label: "none", group: "Unsigned" },
];

const STANDARD_CLAIMS: {
  key: string;
  label: string;
  description: string;
  placeholder: string;
}[] = [
  {
    key: "iss",
    label: "Issuer (iss)",
    description: "Who issued this token",
    placeholder: "https://example.com",
  },
  {
    key: "sub",
    label: "Subject (sub)",
    description: "Who the token is about",
    placeholder: "user-123",
  },
  {
    key: "aud",
    label: "Audience (aud)",
    description: "Intended recipient",
    placeholder: "https://api.example.com",
  },
  {
    key: "jti",
    label: "JWT ID (jti)",
    description: "Unique token identifier",
    placeholder: "unique-id-123",
  },
];

const EXPIRATION_PRESETS = [
  { label: "5 min", seconds: 300 },
  { label: "15 min", seconds: 900 },
  { label: "1 hour", seconds: 3600 },
  { label: "24 hours", seconds: 86400 },
  { label: "7 days", seconds: 604800 },
  { label: "30 days", seconds: 2592000 },
  { label: "1 year", seconds: 31536000 },
];

const SAMPLE_PAYLOADS: {
  label: string;
  claims: Record<string, string>;
  customClaims: Claim[];
}[] = [
  {
    label: "Auth Token",
    claims: {
      iss: "https://auth.example.com",
      sub: "user-42",
      aud: "https://api.example.com",
      jti: "",
    },
    customClaims: [
      { id: "1", key: "name", value: "Jane Doe", type: "string" },
      { id: "2", key: "email", value: "jane@example.com", type: "string" },
      { id: "3", key: "role", value: "admin", type: "string" },
    ],
  },
  {
    label: "API Key",
    claims: {
      iss: "https://dashboard.example.com",
      sub: "service-account-1",
      aud: "https://api.example.com",
      jti: "",
    },
    customClaims: [
      { id: "1", key: "scope", value: '["read","write"]', type: "json" },
      { id: "2", key: "tier", value: "pro", type: "string" },
    ],
  },
  {
    label: "Minimal",
    claims: { iss: "", sub: "user-1", aud: "", jti: "" },
    customClaims: [],
  },
];

function base64UrlEncode(data: Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof data === "string") {
    bytes = new TextEncoder().encode(data);
  } else {
    bytes = data;
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

let claimCounter = 0;
function nextClaimId() {
  return `claim-${++claimCounter}`;
}

export default function JwtBuilderTool() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("HS256");
  const [standardClaims, setStandardClaims] = useState<Record<string, string>>({
    iss: "",
    sub: "",
    aud: "",
    jti: "",
  });
  const [includeIat, setIncludeIat] = useState(true);
  const [includeExp, setIncludeExp] = useState(true);
  const [includeNbf, setIncludeNbf] = useState(false);
  const [expSeconds, setExpSeconds] = useState(3600);
  const [customClaims, setCustomClaims] = useState<Claim[]>([]);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [privateKey, setPrivateKey] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [keyGenerating, setKeyGenerating] = useState(false);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("jwt-builder");
  const { trackAction } = useToolAnalytics("jwt-builder");

  const isHmac = algorithm.startsWith("HS");
  const isAsymmetric = algorithm.startsWith("RS") || algorithm.startsWith("ES");

  const buildPayload = useCallback((): Record<string, unknown> => {
    const payload: Record<string, unknown> = {};
    const now = Math.floor(Date.now() / 1000);

    for (const { key } of STANDARD_CLAIMS) {
      const val = standardClaims[key]?.trim();
      if (val) payload[key] = val;
    }

    if (includeIat) payload.iat = now;
    if (includeNbf) payload.nbf = now;
    if (includeExp) payload.exp = now + expSeconds;

    for (const claim of customClaims) {
      if (!claim.key.trim()) continue;
      const k = claim.key.trim();
      switch (claim.type) {
        case "number": {
          const n = Number(claim.value);
          payload[k] = isNaN(n) ? claim.value : n;
          break;
        }
        case "boolean":
          payload[k] = claim.value.toLowerCase() === "true";
          break;
        case "json":
          try {
            payload[k] = JSON.parse(claim.value);
          } catch {
            payload[k] = claim.value;
          }
          break;
        default:
          payload[k] = claim.value;
      }
    }

    return payload;
  }, [standardClaims, includeIat, includeNbf, includeExp, expSeconds, customClaims]);

  const handleGenerate = useCallback(async () => {
    if (isLimited) return;
    setError("");
    setOutput("");
    setCopied(false);
    setGenerating(true);

    try {
      const payload = buildPayload();

      if (algorithm === "none") {
        // Unsigned JWT
        const headerB64 = base64UrlEncode(
          JSON.stringify({ alg: "none", typ: "JWT" })
        );
        const payloadB64 = base64UrlEncode(JSON.stringify(payload));
        setOutput(`${headerB64}.${payloadB64}.`);
        recordUsage();
        trackAction("generate");
        return;
      }

      if (isHmac) {
        if (!secret.trim()) {
          setError("Secret is required for HMAC algorithms.");
          return;
        }
        const secretKey = new TextEncoder().encode(secret);
        const token = await new jose.SignJWT(payload as jose.JWTPayload)
          .setProtectedHeader({ alg: algorithm, typ: "JWT" })
          .sign(secretKey);
        setOutput(token);
      } else if (isAsymmetric) {
        if (!privateKey.trim()) {
          setError(
            `Private key (PEM format) is required for ${algorithm}. Click "Generate Key Pair" to create one.`
          );
          return;
        }
        let key: CryptoKey;
        try {
          key = await jose.importPKCS8(privateKey.trim(), algorithm);
        } catch {
          setError(
            "Invalid private key. Paste a PKCS#8 PEM key starting with -----BEGIN PRIVATE KEY-----"
          );
          return;
        }
        const token = await new jose.SignJWT(payload as jose.JWTPayload)
          .setProtectedHeader({ alg: algorithm, typ: "JWT" })
          .sign(key);
        setOutput(token);
      }

      recordUsage();
      trackAction("generate");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate JWT");
    } finally {
      setGenerating(false);
    }
  }, [
    algorithm,
    secret,
    privateKey,
    buildPayload,
    isLimited,
    isHmac,
    isAsymmetric,
    recordUsage,
    trackAction,
  ]);

  useKeyboardShortcut("Enter", handleGenerate);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleGenerateKeyPair = useCallback(async () => {
    setKeyGenerating(true);
    setError("");
    try {
      const { privateKey: priv, publicKey: pub } = await jose.generateKeyPair(
        algorithm as Exclude<Algorithm, "none">
      );
      const privPem = await jose.exportPKCS8(priv);
      const pubPem = await jose.exportSPKI(pub);
      setPrivateKey(
        privPem.trim() + "\n\n# Public key (for verification):\n" + pubPem.trim()
      );
      trackAction("generate-keypair");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to generate key pair"
      );
    } finally {
      setKeyGenerating(false);
    }
  }, [algorithm, trackAction]);

  const addCustomClaim = useCallback(() => {
    setCustomClaims((prev) => [
      ...prev,
      { id: nextClaimId(), key: "", value: "", type: "string" },
    ]);
  }, []);

  const updateCustomClaim = useCallback(
    (id: string, field: keyof Claim, value: string) => {
      setCustomClaims((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
      );
    },
    []
  );

  const removeCustomClaim = useCallback((id: string) => {
    setCustomClaims((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const loadSample = useCallback(
    (index: number) => {
      const sample = SAMPLE_PAYLOADS[index];
      setStandardClaims(sample.claims);
      claimCounter = 0;
      setCustomClaims(
        sample.customClaims.map((c) => ({ ...c, id: nextClaimId() }))
      );
      setOutput("");
      setError("");
      setCopied(false);
      trackAction("load-sample");
    },
    [trackAction]
  );

  const generateJti = useCallback(() => {
    const jti = crypto.randomUUID();
    setStandardClaims((prev) => ({ ...prev, jti }));
  }, []);

  const previewPayload = buildPayload();

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-600";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        JWT Builder
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Build and sign JSON Web Tokens with custom claims and your choice of
        HMAC, RSA, or ECDSA algorithms. All signing happens in your browser.
      </p>

      <div className="space-y-6">
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Presets:
          </span>
          {SAMPLE_PAYLOADS.map((sample, i) => (
            <button
              key={sample.label}
              onClick={() => loadSample(i)}
              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>

        {/* Algorithm */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Algorithm
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {ALGORITHMS.map((alg) => (
              <button
                key={alg.value}
                onClick={() => {
                  setAlgorithm(alg.value);
                  setOutput("");
                  setError("");
                }}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  algorithm === alg.value
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <div className="font-mono">{alg.label}</div>
                <div className="mt-0.5 text-xs font-normal text-gray-500 dark:text-gray-500">
                  {alg.group}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Secret / Key */}
        {isHmac && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Secret
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter your HMAC secret..."
              className={`${inputClass} font-mono`}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              The secret is used to sign the token. Keep it safe — never share
              production secrets.
            </p>
          </div>
        )}

        {isAsymmetric && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Private Key (PKCS#8 PEM)
              </label>
              <button
                onClick={handleGenerateKeyPair}
                disabled={keyGenerating}
                className="rounded-md border border-indigo-300 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors disabled:opacity-50"
              >
                {keyGenerating
                  ? "Generating..."
                  : `Generate ${algorithm.startsWith("RS") ? "RSA" : "ECDSA"} Key Pair`}
              </button>
            </div>
            <textarea
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder={
                "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
              }
              rows={6}
              className={`${inputClass} font-mono text-xs`}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              Paste your PEM private key or click &quot;Generate Key Pair&quot;
              to create one in your browser. Keys never leave your device.
            </p>
          </div>
        )}

        {algorithm === "none" && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300">
            Unsigned tokens (alg: none) should only be used for development and
            testing. Never use unsigned tokens in production.
          </div>
        )}

        {/* Standard Claims */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Standard Claims
          </h2>
          <div className="space-y-3">
            {STANDARD_CLAIMS.map(({ key, label, description, placeholder }) => (
              <div key={key}>
                <div className="mb-1 flex items-baseline gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {description}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={standardClaims[key] || ""}
                    onChange={(e) =>
                      setStandardClaims((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className={`flex-1 ${inputClass} font-mono`}
                  />
                  {key === "jti" && (
                    <button
                      onClick={generateJti}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                      title="Generate UUID"
                    >
                      Generate
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* iat toggle */}
            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-700">
              <input
                type="checkbox"
                checked={includeIat}
                onChange={(e) => setIncludeIat(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Issued At (iat)
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                  Auto-set to current time
                </span>
              </div>
            </label>

            {/* nbf toggle */}
            <label className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-700">
              <input
                type="checkbox"
                checked={includeNbf}
                onChange={(e) => setIncludeNbf(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Not Before (nbf)
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                  Token valid from current time
                </span>
              </div>
            </label>

            {/* exp toggle + duration */}
            <div className="rounded-lg border border-gray-200 px-3 py-2.5 dark:border-gray-700">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={includeExp}
                  onChange={(e) => setIncludeExp(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Expiration (exp)
                  </span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                    Token expires after
                  </span>
                </div>
              </label>
              {includeExp && (
                <div className="mt-2 ml-7 flex flex-wrap gap-1.5">
                  {EXPIRATION_PRESETS.map((preset) => (
                    <button
                      key={preset.seconds}
                      onClick={() => setExpSeconds(preset.seconds)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        expSeconds === preset.seconds
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom Claims */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Custom Claims
            </h2>
            <button
              onClick={addCustomClaim}
              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              + Add Claim
            </button>
          </div>
          {customClaims.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              No custom claims. Click &quot;Add Claim&quot; to add key-value
              pairs.
            </p>
          )}
          <div className="space-y-2">
            {customClaims.map((claim) => (
              <div key={claim.id} className="flex gap-2">
                <input
                  type="text"
                  value={claim.key}
                  onChange={(e) =>
                    updateCustomClaim(claim.id, "key", e.target.value)
                  }
                  placeholder="key"
                  className={`w-28 shrink-0 ${inputClass} font-mono sm:w-36`}
                />
                <input
                  type="text"
                  value={claim.value}
                  onChange={(e) =>
                    updateCustomClaim(claim.id, "value", e.target.value)
                  }
                  placeholder="value"
                  className={`min-w-0 flex-1 ${inputClass} font-mono`}
                />
                <select
                  value={claim.type}
                  onChange={(e) =>
                    updateCustomClaim(claim.id, "type", e.target.value)
                  }
                  className="w-24 shrink-0 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                </select>
                <button
                  onClick={() => removeCustomClaim(claim.id)}
                  className="shrink-0 rounded-lg border border-gray-300 px-2.5 py-2 text-sm text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-red-950 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
                  title="Remove claim"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payload Preview */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Payload Preview
          </h2>
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
            <pre className="overflow-x-auto font-mono text-xs text-gray-800 dark:text-gray-200">
              {JSON.stringify(previewPayload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Generate */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerate}
            disabled={isLimited || generating}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {generating ? "Signing..." : "Sign & Generate"}
            {!generating && (
              <kbd className="ml-1.5 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
                Ctrl+Enter
              </kbd>
            )}
          </button>
          <RateLimitBanner
            remaining={remaining}
            dailyLimit={dailyLimit}
            isLimited={isLimited}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Generated JWT
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <Link
                  href="/tools/jwt-decoder"
                  className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-indigo-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-indigo-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Decode &rarr;
                </Link>
              </div>
            </div>
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
              <code className="block break-all font-mono text-sm text-gray-900 dark:text-gray-100">
                <span className="text-red-600 dark:text-red-400">
                  {output.split(".")[0]}
                </span>
                .
                <span className="text-purple-600 dark:text-purple-400">
                  {output.split(".")[1]}
                </span>
                .
                <span className="text-cyan-600 dark:text-cyan-400">
                  {output.split(".")[2]}
                </span>
              </code>
            </div>
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
              <span className="text-red-600 dark:text-red-400">Header</span>
              {" . "}
              <span className="text-purple-600 dark:text-purple-400">
                Payload
              </span>
              {" . "}
              <span className="text-cyan-600 dark:text-cyan-400">
                Signature
              </span>
            </p>
          </div>
        )}

        {/* Algorithm Reference */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Algorithm Reference
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                HMAC (symmetric)
              </p>
              <p>HS256 / HS384 / HS512</p>
              <p className="mt-1">
                Shared secret key. Simple setup. Both signer and verifier need
                the same key.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                RSA (asymmetric)
              </p>
              <p>RS256 / RS384 / RS512</p>
              <p className="mt-1">
                Public/private key pair. Private key signs, public key verifies.
                Most common in production.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                ECDSA (asymmetric)
              </p>
              <p>ES256 / ES384 / ES512</p>
              <p className="mt-1">
                Elliptic curve keys. Smaller keys, same security as RSA. Faster
                verification.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-600">
          Complement to{" "}
          <Link
            href="/tools/jwt-decoder"
            className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400"
          >
            JWT Decoder
          </Link>
          . Build tokens here, decode and inspect them there.
        </p>
      </div>
    </div>
  );
}
