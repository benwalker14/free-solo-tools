"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";
import RateLimitBanner from "@/components/RateLimitBanner";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores",
  "quas", "molestias", "excepturi", "obcaecati", "cupiditate", "provident",
  "similique", "mollitia", "animi", "perspiciatis", "unde", "omnis", "iste",
  "natus", "error", "voluptatem", "accusantium", "doloremque", "laudantium",
  "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore",
  "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo",
  "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit", "fugit",
  "consequuntur", "magni", "ratione", "sequi", "nesciunt", "neque", "porro",
  "quisquam", "dolorem", "adipisci", "numquam", "eius", "modi", "tempora",
  "magnam", "quaerat", "vel", "illum", "quo", "tenetur", "sapiente", "delectus",
  "rerum", "hic", "facilis", "expedita", "distinctio", "nam", "libero",
  "recusandae", "nihil", "impedit", "minus", "assumenda", "optio", "repellendus",
  "temporibus", "quibusdam", "soluta", "nobis", "eligendi", "cumque",
  "placeat", "facere", "possimus",
];

const CLASSIC_OPENING =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type OutputUnit = "paragraphs" | "sentences" | "words";

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function randomWord(): string {
  return LOREM_WORDS[randomInt(LOREM_WORDS.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(minWords: number = 6, maxWords: number = 16): string {
  const len = minWords + randomInt(maxWords - minWords + 1);
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    words.push(randomWord());
  }
  return capitalize(words.join(" ")) + ".";
}

function generateParagraph(minSentences: number = 3, maxSentences: number = 7): string {
  const len = minSentences + randomInt(maxSentences - minSentences + 1);
  const sentences: string[] = [];
  for (let i = 0; i < len; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

function generateLorem(
  unit: OutputUnit,
  count: number,
  startWithClassic: boolean,
): string {
  const clamped = Math.max(1, Math.min(100, count));

  if (unit === "words") {
    const words: string[] = [];
    for (let i = 0; i < clamped; i++) {
      words.push(randomWord());
    }
    let result = words.join(" ");
    if (startWithClassic) {
      const classicWords = "lorem ipsum dolor sit amet".split(" ");
      const merged = [...classicWords, ...words.slice(classicWords.length)];
      result = merged.slice(0, clamped).join(" ");
    }
    return capitalize(result) + ".";
  }

  if (unit === "sentences") {
    const sentences: string[] = [];
    for (let i = 0; i < clamped; i++) {
      sentences.push(generateSentence());
    }
    if (startWithClassic) {
      sentences[0] = CLASSIC_OPENING;
    }
    return sentences.join(" ");
  }

  // paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < clamped; i++) {
    paragraphs.push(generateParagraph());
  }
  if (startWithClassic) {
    paragraphs[0] = CLASSIC_OPENING + " " + paragraphs[0];
  }
  return paragraphs.join("\n\n");
}

export default function LoremIpsumTool() {
  const [output, setOutput] = useState("");
  const [unit, setUnit] = useState<OutputUnit>("paragraphs");
  const [count, setCount] = useState(5);
  const [startClassic, setStartClassic] = useState(true);
  const [copied, setCopied] = useState(false);

  const { remaining, dailyLimit, isLimited, recordUsage } =
    useRateLimit("lorem-ipsum");
  const { trackAction } = useToolAnalytics("lorem-ipsum");

  const handleGenerate = useCallback(() => {
    if (isLimited) return;
    recordUsage();
    trackAction("generate");
    setOutput(generateLorem(unit, count, startClassic));
    setCopied(false);
  }, [unit, count, startClassic, isLimited, recordUsage, trackAction]);

  useKeyboardShortcut("Enter", handleGenerate);

  function handleCopy() {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const charCount = output.length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Lorem Ipsum Generator
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Generate placeholder text for your designs and layouts.
      </p>

      {/* Options */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        {/* Unit selector */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Generate
          </label>
          <div className="flex gap-2">
            {(["paragraphs", "sentences", "words"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors capitalize ${
                  unit === u
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-300"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Count
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) =>
                setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
              }
              className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <input
            type="range"
            min={1}
            max={unit === "words" ? 100 : unit === "sentences" ? 50 : 20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* Start with classic */}
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            checked={startClassic}
            onChange={(e) => setStartClassic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 accent-indigo-600"
          />
          Start with &ldquo;Lorem ipsum dolor sit amet...&rdquo;
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={handleGenerate}
          disabled={isLimited}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          Generate{" "}
          <kbd className="ml-1 hidden rounded bg-indigo-500 px-1.5 py-0.5 text-xs font-normal text-indigo-100 sm:inline">
            Ctrl+Enter
          </kbd>
        </button>

        {output && (
          <>
            <button
              onClick={handleCopy}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => {
                setOutput("");
                setCopied(false);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              Clear
            </button>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {wordCount} words &middot; {charCount} chars
            </span>
          </>
        )}
        <RateLimitBanner
          remaining={remaining}
          dailyLimit={dailyLimit}
          isLimited={isLimited}
        />
      </div>

      {/* Output */}
      {output && (
        <div className="mt-4 rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-950">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {output}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          What is Lorem Ipsum?
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Lorem Ipsum is placeholder text used in publishing and design since the 1500s.
          </li>
          <li>
            It helps visualize how content will look without being distracted by meaningful text.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
