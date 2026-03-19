"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface Model {
  name: string;
  provider: string;
  family: string;
  tier: "flagship" | "mid" | "budget";
  inputPrice: number; // per 1M tokens
  outputPrice: number; // per 1M tokens
  contextWindow: number;
  maxOutput: number;
  multimodal: boolean;
  reasoning: boolean;
  toolUse: boolean;
  openSource: boolean;
  released: string; // YYYY-MM
  notes: string;
}

interface CodingIDE {
  name: string;
  provider: string;
  freeTier: string;
  proPrice: string;
  proPlusPrice: string;
  topTier: string;
  aiModels: string;
  agentMode: boolean;
  platform: string;
  notes: string;
}

const MODELS: Model[] = [
  // OpenAI
  {
    name: "GPT-4.1",
    provider: "OpenAI",
    family: "GPT-4.1",
    tier: "flagship",
    inputPrice: 2.0,
    outputPrice: 8.0,
    contextWindow: 1048576,
    maxOutput: 32768,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2025-04",
    notes: "Best for coding, instruction following",
  },
  {
    name: "GPT-4.1 mini",
    provider: "OpenAI",
    family: "GPT-4.1",
    tier: "mid",
    inputPrice: 0.4,
    outputPrice: 1.6,
    contextWindow: 1048576,
    maxOutput: 32768,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2025-04",
    notes: "Fast and affordable, great for most tasks",
  },
  {
    name: "GPT-4.1 nano",
    provider: "OpenAI",
    family: "GPT-4.1",
    tier: "budget",
    inputPrice: 0.1,
    outputPrice: 0.4,
    contextWindow: 1048576,
    maxOutput: 32768,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2025-04",
    notes: "Cheapest OpenAI model, edge/mobile use",
  },
  {
    name: "GPT-4o",
    provider: "OpenAI",
    family: "GPT-4o",
    tier: "flagship",
    inputPrice: 2.5,
    outputPrice: 10.0,
    contextWindow: 128000,
    maxOutput: 16384,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2024-05",
    notes: "Strong all-rounder, wide tool support",
  },
  {
    name: "GPT-4o mini",
    provider: "OpenAI",
    family: "GPT-4o",
    tier: "budget",
    inputPrice: 0.15,
    outputPrice: 0.6,
    contextWindow: 128000,
    maxOutput: 16384,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2024-07",
    notes: "Lightweight, fast, very cheap",
  },
  {
    name: "o3",
    provider: "OpenAI",
    family: "o-series",
    tier: "flagship",
    inputPrice: 2.0,
    outputPrice: 8.0,
    contextWindow: 200000,
    maxOutput: 100000,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2025-04",
    notes: "Top reasoning model, great for math/code",
  },
  {
    name: "o4-mini",
    provider: "OpenAI",
    family: "o-series",
    tier: "mid",
    inputPrice: 1.1,
    outputPrice: 4.4,
    contextWindow: 200000,
    maxOutput: 100000,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2025-04",
    notes: "Efficient reasoning, good cost/performance",
  },
  // Anthropic
  {
    name: "Claude Opus 4.6",
    provider: "Anthropic",
    family: "Claude 4.6",
    tier: "flagship",
    inputPrice: 5.0,
    outputPrice: 25.0,
    contextWindow: 1048576,
    maxOutput: 131072,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2026-01",
    notes: "1M context, top coding & agentic, extended thinking",
  },
  {
    name: "Claude Sonnet 4.6",
    provider: "Anthropic",
    family: "Claude 4.6",
    tier: "mid",
    inputPrice: 3.0,
    outputPrice: 15.0,
    contextWindow: 1048576,
    maxOutput: 65536,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2026-01",
    notes: "1M context, best balance of intelligence and speed",
  },
  {
    name: "Claude Haiku 4.5",
    provider: "Anthropic",
    family: "Claude 4.5",
    tier: "budget",
    inputPrice: 0.25,
    outputPrice: 1.25,
    contextWindow: 200000,
    maxOutput: 8192,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2025-10",
    notes: "Ultra-cheap, fast, good for simple tasks",
  },
  // Google
  {
    name: "Gemini 3.1 Pro",
    provider: "Google",
    family: "Gemini 3",
    tier: "flagship",
    inputPrice: 2.0,
    outputPrice: 12.0,
    contextWindow: 1048576,
    maxOutput: 65536,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2026-02",
    notes: "Latest Google flagship, 1M context, strong reasoning",
  },
  {
    name: "Gemini 3 Flash",
    provider: "Google",
    family: "Gemini 3",
    tier: "mid",
    inputPrice: 0.5,
    outputPrice: 3.0,
    contextWindow: 1048576,
    maxOutput: 65536,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2026-01",
    notes: "Fast and cheap, 1M context with thinking",
  },
  {
    name: "Gemini 2.5 Pro",
    provider: "Google",
    family: "Gemini 2.5",
    tier: "flagship",
    inputPrice: 1.25,
    outputPrice: 10.0,
    contextWindow: 1048576,
    maxOutput: 65536,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2025-03",
    notes: "1M context, strong reasoning, built-in thinking",
  },
  {
    name: "Gemini 2.5 Flash",
    provider: "Google",
    family: "Gemini 2.5",
    tier: "mid",
    inputPrice: 0.15,
    outputPrice: 0.6,
    contextWindow: 1048576,
    maxOutput: 65536,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2025-04",
    notes: "Cheapest 1M context model with thinking",
  },
  {
    name: "Gemini 2.0 Flash",
    provider: "Google",
    family: "Gemini 2.0",
    tier: "budget",
    inputPrice: 0.1,
    outputPrice: 0.4,
    contextWindow: 1048576,
    maxOutput: 8192,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2025-02",
    notes: "Ultra-cheap, 1M context, fast",
  },
  // Meta
  {
    name: "Llama 4 Maverick",
    provider: "Meta",
    family: "Llama 4",
    tier: "flagship",
    inputPrice: 0.5,
    outputPrice: 0.5,
    contextWindow: 1048576,
    maxOutput: 32768,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: true,
    released: "2025-04",
    notes: "Open-source, MoE, 1M context",
  },
  {
    name: "Llama 4 Scout",
    provider: "Meta",
    family: "Llama 4",
    tier: "mid",
    inputPrice: 0.2,
    outputPrice: 0.2,
    contextWindow: 524288,
    maxOutput: 32768,
    multimodal: true,
    reasoning: false,
    toolUse: true,
    openSource: true,
    released: "2025-04",
    notes: "Open-source, efficient, 512K context",
  },
  // Mistral
  {
    name: "Mistral Large",
    provider: "Mistral",
    family: "Mistral",
    tier: "flagship",
    inputPrice: 2.0,
    outputPrice: 6.0,
    contextWindow: 128000,
    maxOutput: 8192,
    multimodal: false,
    reasoning: false,
    toolUse: true,
    openSource: false,
    released: "2024-11",
    notes: "Strong multilingual, EU-based provider",
  },
  {
    name: "Codestral",
    provider: "Mistral",
    family: "Mistral",
    tier: "mid",
    inputPrice: 0.3,
    outputPrice: 0.9,
    contextWindow: 256000,
    maxOutput: 8192,
    multimodal: false,
    reasoning: false,
    toolUse: false,
    openSource: false,
    released: "2025-01",
    notes: "Specialized code model, 256K context",
  },
  // DeepSeek
  {
    name: "DeepSeek V3",
    provider: "DeepSeek",
    family: "DeepSeek",
    tier: "mid",
    inputPrice: 0.27,
    outputPrice: 1.1,
    contextWindow: 131072,
    maxOutput: 8192,
    multimodal: false,
    reasoning: false,
    toolUse: true,
    openSource: true,
    released: "2024-12",
    notes: "Open-source, strong coding, very cheap",
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    family: "DeepSeek",
    tier: "flagship",
    inputPrice: 0.55,
    outputPrice: 2.19,
    contextWindow: 131072,
    maxOutput: 8192,
    multimodal: false,
    reasoning: true,
    toolUse: false,
    openSource: true,
    released: "2025-01",
    notes: "Open-source reasoning model, chain-of-thought",
  },
  // xAI
  {
    name: "Grok 3",
    provider: "xAI",
    family: "Grok",
    tier: "flagship",
    inputPrice: 3.0,
    outputPrice: 15.0,
    contextWindow: 131072,
    maxOutput: 16384,
    multimodal: true,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2025-02",
    notes: "Real-time data via X, strong reasoning",
  },
  {
    name: "Grok 3 mini",
    provider: "xAI",
    family: "Grok",
    tier: "mid",
    inputPrice: 0.3,
    outputPrice: 0.5,
    contextWindow: 131072,
    maxOutput: 16384,
    multimodal: false,
    reasoning: true,
    toolUse: true,
    openSource: false,
    released: "2025-03",
    notes: "Lightweight, fast reasoning, cheap",
  },
];

const CODING_IDES: CodingIDE[] = [
  {
    name: "Cursor",
    provider: "Anysphere",
    freeTier: "Free (limited)",
    proPrice: "$20/mo",
    proPlusPrice: "$60/mo",
    topTier: "$200/mo Ultra",
    aiModels: "GPT-4.1, Claude Sonnet 4.6, Gemini 2.5",
    agentMode: true,
    platform: "VS Code fork",
    notes: "Most popular AI IDE, credit-based since mid-2025",
  },
  {
    name: "GitHub Copilot",
    provider: "Microsoft",
    freeTier: "Free (2K completions)",
    proPrice: "$10/mo",
    proPlusPrice: "$39/mo",
    topTier: "$39/user Enterprise",
    aiModels: "GPT-4.1, Claude Opus 4, o3",
    agentMode: true,
    platform: "VS Code / JetBrains / CLI",
    notes: "Widest IDE support, coding agent in Pro+",
  },
  {
    name: "Windsurf",
    provider: "Codeium",
    freeTier: "Free (25 credits)",
    proPrice: "$15/mo",
    proPlusPrice: "\u2014",
    topTier: "$60/user Enterprise",
    aiModels: "GPT, Claude, Gemini, custom",
    agentMode: true,
    platform: "VS Code fork",
    notes: "Cheapest Pro tier, Cascade autonomous agent",
  },
  {
    name: "Kiro",
    provider: "Amazon / AWS",
    freeTier: "Free (50 credits)",
    proPrice: "$20/mo",
    proPlusPrice: "$40/mo",
    topTier: "$200/mo Power",
    aiModels: "Claude Sonnet, Amazon Bedrock",
    agentMode: true,
    platform: "VS Code fork",
    notes: "Spec-driven development, Kiro hooks, free student plan",
  },
  {
    name: "Google Antigravity",
    provider: "Google",
    freeTier: "Free (rate-limited)",
    proPrice: "$20\u2013$25/mo",
    proPlusPrice: "\u2014",
    topTier: "$50\u2013$250/mo Ultra",
    aiModels: "Gemini 3.1 Pro, Claude Opus 4.6",
    agentMode: true,
    platform: "VS Code fork (cross-platform)",
    notes: "Agent-first IDE, credit system, pricing still evolving",
  },
];

const PROVIDERS = [...new Set(MODELS.map((m) => m.provider))];

type SortKey =
  | "name"
  | "inputPrice"
  | "outputPrice"
  | "contextWindow"
  | "maxOutput"
  | "released";
type SortDir = "asc" | "desc";

function formatContext(n: number): string {
  if (n >= 1048576) return `${(n / 1048576).toFixed(0)}M`;
  return `${(n / 1000).toFixed(0)}K`;
}

function formatPrice(n: number): string {
  if (n < 0.1) return `$${n.toFixed(2)}`;
  if (n < 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

function Badge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${
        active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}

function TierBadge({ tier }: { tier: Model["tier"] }) {
  const styles = {
    flagship:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    mid: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    budget:
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${styles[tier]}`}
    >
      {tier}
    </span>
  );
}

const PROVIDER_COLORS: Record<string, string> = {
  OpenAI: "text-green-600 dark:text-green-400",
  Anthropic: "text-orange-600 dark:text-orange-400",
  Google: "text-blue-600 dark:text-blue-400",
  Meta: "text-sky-600 dark:text-sky-400",
  Mistral: "text-purple-600 dark:text-purple-400",
  DeepSeek: "text-cyan-600 dark:text-cyan-400",
  xAI: "text-gray-600 dark:text-gray-400",
};

const IDE_PROVIDER_COLORS: Record<string, string> = {
  Anysphere: "text-violet-600 dark:text-violet-400",
  Microsoft: "text-blue-600 dark:text-blue-400",
  Codeium: "text-teal-600 dark:text-teal-400",
  "Amazon / AWS": "text-orange-600 dark:text-orange-400",
  Google: "text-blue-600 dark:text-blue-400",
};

function SortHeader({
  label,
  field,
  className,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortKey;
  className?: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  return (
    <th
      className={`cursor-pointer select-none pb-2 font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${className ?? ""}`}
      onClick={() => onSort(field)}
    >
      {label}
      {sortKey === field && (
        <span className="ml-0.5">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>
      )}
    </th>
  );
}

export default function AIModelComparisonTool() {
  const [view, setView] = useState<"models" | "ides">("models");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [tierFilter, setTierFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("inputPrice");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showReasoning, setShowReasoning] = useState(false);
  const [showOpenSource, setShowOpenSource] = useState(false);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [ideSearch, setIdeSearch] = useState("");
  const { trackFirstInteraction } = useToolAnalytics("ai-model-comparison");

  const filteredModels = useMemo(() => {
    let result = MODELS;
    if (providerFilter !== "All") {
      result = result.filter((m) => m.provider === providerFilter);
    }
    if (tierFilter !== "All") {
      result = result.filter((m) => m.tier === tierFilter);
    }
    if (showReasoning) {
      result = result.filter((m) => m.reasoning);
    }
    if (showOpenSource) {
      result = result.filter((m) => m.openSource);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.notes.toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return result;
  }, [
    providerFilter,
    tierFilter,
    search,
    sortKey,
    sortDir,
    showReasoning,
    showOpenSource,
  ]);

  const filteredIDEs = useMemo(() => {
    if (!ideSearch.trim()) return CODING_IDES;
    const q = ideSearch.toLowerCase();
    return CODING_IDES.filter(
      (ide) =>
        ide.name.toLowerCase().includes(q) ||
        ide.provider.toLowerCase().includes(q) ||
        ide.aiModels.toLowerCase().includes(q) ||
        ide.notes.toLowerCase().includes(q)
    );
  }, [ideSearch]);

  const compareModels = MODELS.filter((m) => compareIds.has(m.name));

  function toggleSort(key: SortKey) {
    trackFirstInteraction();
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleCompare(name: string) {
    trackFirstInteraction();
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < 4) {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
        AI Model Comparison
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Compare pricing, context windows, and capabilities of{" "}
        {MODELS.length} API models from {PROVIDERS.length} providers, plus{" "}
        {CODING_IDES.length} AI coding IDEs. Updated March 2026.
      </p>

      {/* View Toggle */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800 w-fit">
        <button
          onClick={() => {
            setView("models");
            trackFirstInteraction();
          }}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            view === "models"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          API Models ({MODELS.length})
        </button>
        <button
          onClick={() => {
            setView("ides");
            trackFirstInteraction();
          }}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            view === "ides"
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-900 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          Coding IDEs ({CODING_IDES.length})
        </button>
      </div>

      {view === "models" ? (
        <>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                trackFirstInteraction();
              }}
              placeholder="Search models..."
              className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
            <select
              value={providerFilter}
              onChange={(e) => {
                setProviderFilter(e.target.value);
                trackFirstInteraction();
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Providers</option>
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                trackFirstInteraction();
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Tiers</option>
              <option value="flagship">Flagship</option>
              <option value="mid">Mid-tier</option>
              <option value="budget">Budget</option>
            </select>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={showReasoning}
                onChange={(e) => {
                  setShowReasoning(e.target.checked);
                  trackFirstInteraction();
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Reasoning
            </label>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <input
                type="checkbox"
                checked={showOpenSource}
                onChange={(e) => {
                  setShowOpenSource(e.target.checked);
                  trackFirstInteraction();
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Open Source
            </label>
          </div>

          {/* Compare bar */}
          {compareIds.size > 0 && (
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-800 dark:bg-indigo-950/30">
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {compareIds.size} selected
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[...compareIds].map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                  >
                    {name}
                    <button
                      onClick={() => toggleCompare(name)}
                      className="ml-0.5 hover:text-indigo-900 dark:hover:text-indigo-100"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={() => setShowCompare(true)}
                disabled={compareIds.size < 2}
                className="ml-auto rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
              >
                Compare
              </button>
              <button
                onClick={() => {
                  setCompareIds(new Set());
                  setShowCompare(false);
                }}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear
              </button>
            </div>
          )}

          {/* Compare Modal */}
          {showCompare && compareModels.length >= 2 && (
            <div className="mb-6 rounded-lg border border-indigo-200 bg-white p-4 dark:border-indigo-800 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Side-by-Side Comparison
                </h2>
                <button
                  onClick={() => setShowCompare(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400"
                >
                  Close
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="pb-2 text-left font-medium text-gray-500 dark:text-gray-400 w-36">
                        Attribute
                      </th>
                      {compareModels.map((m) => (
                        <th
                          key={m.name}
                          className="pb-2 text-center font-medium text-gray-900 dark:text-white"
                        >
                          {m.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 dark:text-gray-300">
                    {(
                      [
                        ["Provider", (m: Model) => m.provider],
                        ["Tier", (m: Model) => m.tier],
                        [
                          "Input Price",
                          (m: Model) => `${formatPrice(m.inputPrice)}/1M`,
                        ],
                        [
                          "Output Price",
                          (m: Model) => `${formatPrice(m.outputPrice)}/1M`,
                        ],
                        [
                          "Context Window",
                          (m: Model) => formatContext(m.contextWindow),
                        ],
                        [
                          "Max Output",
                          (m: Model) => formatContext(m.maxOutput),
                        ],
                        [
                          "Multimodal",
                          (m: Model) => (m.multimodal ? "Yes" : "No"),
                        ],
                        [
                          "Reasoning",
                          (m: Model) => (m.reasoning ? "Yes" : "No"),
                        ],
                        [
                          "Tool Use",
                          (m: Model) => (m.toolUse ? "Yes" : "No"),
                        ],
                        [
                          "Open Source",
                          (m: Model) => (m.openSource ? "Yes" : "No"),
                        ],
                        ["Released", (m: Model) => m.released],
                        ["Notes", (m: Model) => m.notes],
                      ] as [string, (m: Model) => string][]
                    ).map(([label, fn]) => (
                      <tr
                        key={label}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        <td className="py-2 font-medium text-gray-500 dark:text-gray-400">
                          {label}
                        </td>
                        {compareModels.map((m) => (
                          <td key={m.name} className="py-2 text-center">
                            {fn(m)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Main Table */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400 w-8">
                      <span className="sr-only">Compare</span>
                    </th>
                    <SortHeader
                      label="Model"
                      field="name"
                      className="px-3 pb-2 pt-3 text-left"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortHeader
                      label="Input $/1M"
                      field="inputPrice"
                      className="px-3 pb-2 pt-3 text-right"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortHeader
                      label="Output $/1M"
                      field="outputPrice"
                      className="px-3 pb-2 pt-3 text-right"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortHeader
                      label="Context"
                      field="contextWindow"
                      className="px-3 pb-2 pt-3 text-right"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <SortHeader
                      label="Max Output"
                      field="maxOutput"
                      className="hidden px-3 pb-2 pt-3 text-right sm:table-cell"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                    <th className="hidden px-3 pb-2 pt-3 text-center font-medium text-gray-500 dark:text-gray-400 md:table-cell">
                      Capabilities
                    </th>
                    <SortHeader
                      label="Released"
                      field="released"
                      className="hidden px-3 pb-2 pt-3 text-right lg:table-cell"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={toggleSort}
                    />
                  </tr>
                </thead>
                <tbody>
                  {filteredModels.map((m) => (
                    <tr
                      key={m.name}
                      className={`border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 ${
                        compareIds.has(m.name)
                          ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={compareIds.has(m.name)}
                          onChange={() => toggleCompare(m.name)}
                          disabled={
                            !compareIds.has(m.name) && compareIds.size >= 4
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {m.name}
                            </div>
                            <div
                              className={`text-xs ${PROVIDER_COLORS[m.provider] ?? "text-gray-500"}`}
                            >
                              {m.provider}
                            </div>
                          </div>
                          <TierBadge tier={m.tier} />
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-gray-700 dark:text-gray-300">
                        {formatPrice(m.inputPrice)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-gray-700 dark:text-gray-300">
                        {formatPrice(m.outputPrice)}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-700 dark:text-gray-300">
                        {formatContext(m.contextWindow)}
                      </td>
                      <td className="hidden px-3 py-2 text-right text-gray-700 dark:text-gray-300 sm:table-cell">
                        {formatContext(m.maxOutput)}
                      </td>
                      <td className="hidden px-3 py-2 md:table-cell">
                        <div className="flex flex-wrap justify-center gap-1">
                          {m.multimodal && <Badge active label="Vision" />}
                          {m.reasoning && <Badge active label="Reasoning" />}
                          {m.toolUse && <Badge active label="Tools" />}
                          {m.openSource && <Badge active label="OSS" />}
                        </div>
                      </td>
                      <td className="hidden px-3 py-2 text-right text-xs text-gray-500 dark:text-gray-400 lg:table-cell">
                        {m.released}
                      </td>
                    </tr>
                  ))}
                  {filteredModels.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No models match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {MODELS.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Models
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(Math.min(...MODELS.map((m) => m.inputPrice)))}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Cheapest Input /1M
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatContext(
                  Math.max(...MODELS.map((m) => m.contextWindow))
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Largest Context
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {MODELS.filter((m) => m.reasoning).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Reasoning Models
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* IDE Search */}
          <div className="mb-6">
            <input
              type="text"
              value={ideSearch}
              onChange={(e) => {
                setIdeSearch(e.target.value);
                trackFirstInteraction();
              }}
              placeholder="Search coding IDEs..."
              className="w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>

          {/* IDE Comparison Table */}
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      IDE
                    </th>
                    <th className="px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Free Tier
                    </th>
                    <th className="px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Pro
                    </th>
                    <th className="px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Pro+
                    </th>
                    <th className="hidden px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400 sm:table-cell">
                      Top Tier
                    </th>
                    <th className="hidden px-3 pb-2 pt-3 text-left font-medium text-gray-500 dark:text-gray-400 md:table-cell">
                      AI Models
                    </th>
                    <th className="hidden px-3 pb-2 pt-3 text-center font-medium text-gray-500 dark:text-gray-400 lg:table-cell">
                      Agent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIDEs.map((ide) => (
                    <tr
                      key={ide.name}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-3 py-3">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {ide.name}
                          </div>
                          <div
                            className={`text-xs ${IDE_PROVIDER_COLORS[ide.provider] ?? "text-gray-500"}`}
                          >
                            {ide.provider}
                          </div>
                          <div className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            {ide.platform}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                        <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {ide.freeTier}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-900 dark:text-white">
                        {ide.proPrice}
                      </td>
                      <td className="px-3 py-3 font-medium text-gray-900 dark:text-white">
                        {ide.proPlusPrice}
                      </td>
                      <td className="hidden px-3 py-3 text-gray-700 dark:text-gray-300 sm:table-cell">
                        {ide.topTier}
                      </td>
                      <td className="hidden px-3 py-3 text-xs text-gray-600 dark:text-gray-400 md:table-cell max-w-48">
                        {ide.aiModels}
                      </td>
                      <td className="hidden px-3 py-3 text-center lg:table-cell">
                        {ide.agentMode && (
                          <Badge active label="Agent" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredIDEs.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No IDEs match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* IDE Notes */}
          <div className="mt-4 space-y-2">
            {filteredIDEs.map((ide) => (
              <div
                key={ide.name}
                className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300 shrink-0">
                  {ide.name}:
                </span>
                <span>{ide.notes}</span>
              </div>
            ))}
          </div>

          {/* IDE Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {CODING_IDES.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                AI Coding IDEs
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                $10/mo
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Cheapest Pro Plan
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-center dark:border-gray-700 dark:bg-gray-900">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {CODING_IDES.filter((i) => i.agentMode).length}/{CODING_IDES.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Have Agent Mode
              </div>
            </div>
          </div>
        </>
      )}

      {/* Info section */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          About This Comparison
        </h2>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          {view === "models" ? (
            <>
              <p>
                <strong>Pricing</strong> reflects publicly listed API prices as
                of March 2026. Actual costs may vary with batch pricing, prompt
                caching, or volume discounts. Meta/Llama prices are based on
                common API providers (Together, Fireworks).
              </p>
              <p>
                <strong>Tiers:</strong> Flagship = most capable model in the
                family, Mid = balanced cost/performance, Budget = cheapest
                option.
              </p>
              <p>
                <strong>Capabilities:</strong> Vision = image/document input,
                Reasoning = built-in chain-of-thought or thinking, Tools =
                function calling / tool use, OSS = open-source weights available.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Pricing</strong> reflects publicly listed subscription
                prices as of March 2026. Most IDEs have shifted to credit-based
                systems where usage varies by model. Annual billing typically
                saves 15-20%.
              </p>
              <p>
                <strong>Agent Mode</strong> indicates the IDE supports
                autonomous multi-step coding agents that can plan, execute, and
                verify tasks across files, terminal, and browser.
              </p>
              <p>
                <strong>AI Models</strong> shows the primary models available in
                each IDE. Most support multiple providers and let you bring your
                own API key.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
