"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { encode } from "gpt-tokenizer";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  contextWindow: number;
}

const MODELS: ModelInfo[] = [
  // OpenAI
  { id: "gpt-4.1", name: "GPT-4.1", provider: "OpenAI", inputPrice: 2.0, outputPrice: 8.0, contextWindow: 1048576 },
  { id: "gpt-4.1-mini", name: "GPT-4.1 mini", provider: "OpenAI", inputPrice: 0.4, outputPrice: 1.6, contextWindow: 1048576 },
  { id: "gpt-4.1-nano", name: "GPT-4.1 nano", provider: "OpenAI", inputPrice: 0.1, outputPrice: 0.4, contextWindow: 1048576 },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", inputPrice: 2.5, outputPrice: 10.0, contextWindow: 128000 },
  { id: "gpt-4o-mini", name: "GPT-4o mini", provider: "OpenAI", inputPrice: 0.15, outputPrice: 0.6, contextWindow: 128000 },
  { id: "o3", name: "o3", provider: "OpenAI", inputPrice: 2.0, outputPrice: 8.0, contextWindow: 200000 },
  { id: "o3-mini", name: "o3 mini", provider: "OpenAI", inputPrice: 1.1, outputPrice: 4.4, contextWindow: 200000 },
  { id: "o4-mini", name: "o4-mini", provider: "OpenAI", inputPrice: 1.1, outputPrice: 4.4, contextWindow: 200000 },
  // Anthropic
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", inputPrice: 15.0, outputPrice: 75.0, contextWindow: 200000 },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", inputPrice: 3.0, outputPrice: 15.0, contextWindow: 200000 },
  { id: "claude-haiku-3.5", name: "Claude 3.5 Haiku", provider: "Anthropic", inputPrice: 0.8, outputPrice: 4.0, contextWindow: 200000 },
  // Google
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", inputPrice: 1.25, outputPrice: 10.0, contextWindow: 1048576 },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", inputPrice: 0.15, outputPrice: 0.6, contextWindow: 1048576 },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", inputPrice: 0.1, outputPrice: 0.4, contextWindow: 1048576 },
  // Meta (via common API providers)
  { id: "llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta", inputPrice: 0.5, outputPrice: 0.5, contextWindow: 1048576 },
  { id: "llama-4-scout", name: "Llama 4 Scout", provider: "Meta", inputPrice: 0.2, outputPrice: 0.2, contextWindow: 524288 },
  // Mistral
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral", inputPrice: 2.0, outputPrice: 6.0, contextWindow: 128000 },
  // DeepSeek
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", inputPrice: 0.27, outputPrice: 1.1, contextWindow: 131072 },
  { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", inputPrice: 0.55, outputPrice: 2.19, contextWindow: 131072 },
];

const PROVIDERS = [...new Set(MODELS.map((m) => m.provider))];

function formatCost(cost: number): string {
  if (cost === 0) return "$0.00";
  if (cost < 0.001) return `$${cost.toFixed(6)}`;
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function formatContext(n: number): string {
  if (n >= 1048576) return `${(n / 1048576).toFixed(0)}M`;
  return `${(n / 1000).toFixed(0)}K`;
}

const SAMPLE_TEXT = `You are a helpful AI assistant. Please analyze the following code and provide suggestions for improvement.

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(40));
\`\`\`

This function is very slow for large inputs. Can you suggest an optimized version using memoization or dynamic programming? Please explain the time complexity of both approaches.`;

export default function TokenCounterTool() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [outputRatio, setOutputRatio] = useState(1);
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const { trackFirstInteraction } = useToolAnalytics("token-counter");

  const tokenCount = useMemo(() => {
    if (!input.trim()) return 0;
    try {
      return encode(input).length;
    } catch {
      return 0;
    }
  }, [input]);

  const model = MODELS.find((m) => m.id === selectedModel)!;

  const stats = useMemo(() => {
    const text = input;
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 0;

    const outputTokens = Math.round(tokenCount * outputRatio);
    const inputCost = (tokenCount / 1_000_000) * model.inputPrice;
    const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
    const totalCost = inputCost + outputCost;

    const contextUsage = tokenCount / model.contextWindow;

    return {
      characters,
      words,
      lines,
      outputTokens,
      inputCost,
      outputCost,
      totalCost,
      contextUsage,
    };
  }, [input, tokenCount, model, outputRatio]);

  const filteredModels =
    providerFilter === "All"
      ? MODELS
      : MODELS.filter((m) => m.provider === providerFilter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        LLM Token Counter & Cost Calculator
      </h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Count tokens and estimate API costs for GPT-4o, Claude, Gemini, and
        other LLMs. Uses BPE tokenization (cl100k_base).
      </p>

      {/* Model Selection */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              trackFirstInteraction();
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {PROVIDERS.map((provider) => (
              <optgroup key={provider} label={provider}>
                {MODELS.filter((m) => m.provider === provider).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — ${m.inputPrice} / ${m.outputPrice} per 1M tokens
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="w-48">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Output:Input ratio
          </label>
          <select
            value={outputRatio}
            onChange={(e) => setOutputRatio(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={0}>No output (input only)</option>
            <option value={0.5}>0.5x (short reply)</option>
            <option value={1}>1x (equal)</option>
            <option value={2}>2x (detailed reply)</option>
            <option value={3}>3x (long generation)</option>
            <option value={5}>5x (code generation)</option>
          </select>
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-6">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Text / Prompt
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setInput(SAMPLE_TEXT);
                trackFirstInteraction();
              }}
              className="rounded px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 transition-colors"
            >
              Load sample
            </button>
            <button
              onClick={() => setInput("")}
              disabled={!input}
              className="rounded px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            trackFirstInteraction();
          }}
          placeholder="Paste your prompt, system message, or any text to count tokens..."
          rows={10}
          className="w-full rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
      </div>

      {/* Token Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {formatNumber(tokenCount)}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Input Tokens
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatNumber(stats.outputTokens)}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Est. Output Tokens
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCost(stats.totalCost)}
          </div>
          <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Est. Total Cost
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {(stats.contextUsage * 100).toFixed(1)}%
          </div>
          <div className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Context Used ({formatContext(model.contextWindow)})
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      {tokenCount > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Cost Breakdown — {model.name}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Input: {formatNumber(tokenCount)} tokens × ${model.inputPrice} /
                1M
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCost(stats.inputCost)}
              </span>
            </div>
            {stats.outputTokens > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Output: {formatNumber(stats.outputTokens)} tokens × $
                  {model.outputPrice} / 1M
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCost(stats.outputCost)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 dark:border-gray-700">
              <span className="font-medium text-gray-900 dark:text-white">
                Total
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatCost(stats.totalCost)}
              </span>
            </div>
          </div>

          {/* Context window bar */}
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Context window usage</span>
              <span>
                {formatNumber(tokenCount)} / {formatNumber(model.contextWindow)}{" "}
                tokens
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full rounded-full transition-all ${
                  stats.contextUsage > 0.9
                    ? "bg-red-500"
                    : stats.contextUsage > 0.7
                      ? "bg-amber-500"
                      : "bg-indigo-500"
                }`}
                style={{
                  width: `${Math.min(stats.contextUsage * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Text Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.characters)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Characters
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.words)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Words</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatNumber(stats.lines)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Lines</div>
        </div>
      </div>

      {/* Bulk Estimate */}
      {tokenCount > 0 && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Bulk Estimate — if you send this prompt N times
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-2 text-left font-medium text-gray-500 dark:text-gray-400">
                    Requests
                  </th>
                  <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                    Input Tokens
                  </th>
                  <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                    Output Tokens
                  </th>
                  <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                    Est. Cost
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                {[10, 100, 1000, 10000].map((n) => (
                  <tr
                    key={n}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-1.5">{formatNumber(n)}</td>
                    <td className="py-1.5 text-right">
                      {formatNumber(tokenCount * n)}
                    </td>
                    <td className="py-1.5 text-right">
                      {formatNumber(stats.outputTokens * n)}
                    </td>
                    <td className="py-1.5 text-right font-medium">
                      {formatCost(stats.totalCost * n)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Model Comparison Table */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Model Pricing Comparison
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => setProviderFilter("All")}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                providerFilter === "All"
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              All
            </button>
            {PROVIDERS.map((p) => (
              <button
                key={p}
                onClick={() => setProviderFilter(p)}
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  providerFilter === p
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 text-left font-medium text-gray-500 dark:text-gray-400">
                  Model
                </th>
                <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                  Input $/1M
                </th>
                <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                  Output $/1M
                </th>
                <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                  Context
                </th>
                {tokenCount > 0 && (
                  <th className="pb-2 text-right font-medium text-gray-500 dark:text-gray-400">
                    This Prompt
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300">
              {filteredModels.map((m) => {
                const cost =
                  (tokenCount / 1_000_000) * m.inputPrice +
                  ((tokenCount * outputRatio) / 1_000_000) * m.outputPrice;
                return (
                  <tr
                    key={m.id}
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      m.id === selectedModel
                        ? "bg-indigo-50 dark:bg-indigo-950/30"
                        : ""
                    }`}
                  >
                    <td className="py-1.5">
                      <button
                        onClick={() => setSelectedModel(m.id)}
                        className="text-left hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <span className="font-medium">{m.name}</span>
                        <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500">
                          {m.provider}
                        </span>
                      </button>
                    </td>
                    <td className="py-1.5 text-right font-mono">
                      ${m.inputPrice.toFixed(2)}
                    </td>
                    <td className="py-1.5 text-right font-mono">
                      ${m.outputPrice.toFixed(2)}
                    </td>
                    <td className="py-1.5 text-right">
                      {formatContext(m.contextWindow)}
                    </td>
                    {tokenCount > 0 && (
                      <td className="py-1.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCost(cost)}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info section */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          About Token Counting
        </h2>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p>
            This tool uses <strong>BPE tokenization</strong> (cl100k_base
            encoding), which is the tokenizer used by GPT-4, GPT-4o, and
            GPT-4.1 models. Token counts for other providers (Anthropic, Google,
            Meta) are approximations — typically within 5-15% of actual counts.
          </p>
          <p>
            <strong>Pricing</strong> reflects publicly listed API prices as of
            March 2026. Actual costs may vary with batch pricing, prompt caching,
            fine-tuned models, or volume discounts. Output tokens are estimated
            using your selected output:input ratio.
          </p>
          <p>
            <strong>What is a token?</strong> Tokens are the basic units LLMs
            process text in. A token is roughly 3-4 characters or ¾ of a word in
            English. Code, non-English text, and special characters typically use
            more tokens per character.
          </p>
        </div>
      </div>
    </div>
  );
}
