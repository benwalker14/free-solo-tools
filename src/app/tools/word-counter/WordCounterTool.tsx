"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useToolAnalytics } from "@/hooks/useToolAnalytics";

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  avgWordLength: number;
  readingTime: string;
  speakingTime: string;
}

function analyzeText(text: string): TextStats {
  if (!text.trim()) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      avgWordLength: 0,
      readingTime: "0 sec",
      speakingTime: "0 sec",
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  const wordArray = text.trim().split(/\s+/).filter(Boolean);
  const words = wordArray.length;

  // Sentences: split on .!? followed by space or end of string
  const sentences = text
    .split(/[.!?]+(?:\s|$)/)
    .filter((s) => s.trim().length > 0).length;

  // Paragraphs: blocks separated by one or more blank lines
  const paragraphs = text
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0).length;

  const lines = text.split("\n").length;

  const totalWordChars = wordArray.reduce((sum, w) => sum + w.replace(/[^a-zA-Z0-9]/g, "").length, 0);
  const avgWordLength = words > 0 ? Math.round((totalWordChars / words) * 10) / 10 : 0;

  // Average adult reads ~238 words/min, speaks ~150 words/min
  const readingMinutes = words / 238;
  const speakingMinutes = words / 150;

  function formatTime(minutes: number): string {
    if (minutes < 1) {
      const secs = Math.max(1, Math.round(minutes * 60));
      return `${secs} sec`;
    }
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    if (s === 0) return `${m} min`;
    return `${m} min ${s} sec`;
  }

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    avgWordLength,
    readingTime: formatTime(readingMinutes),
    speakingTime: formatTime(speakingMinutes),
  };
}

interface WordFreq {
  word: string;
  count: number;
}

function getTopWords(text: string, limit: number): WordFreq[] {
  if (!text.trim()) return [];

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);

  const freq = new Map<string, number>();
  for (const w of words) {
    freq.set(w, (freq.get(w) || 0) + 1);
  }

  return Array.from(freq.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export default function WordCounterTool() {
  const [input, setInput] = useState("");
  const { trackFirstInteraction } = useToolAnalytics("word-counter");

  const stats = useMemo(() => analyzeText(input), [input]);
  const topWords = useMemo(() => getTopWords(input, 10), [input]);

  function handleInputChange(value: string) {
    setInput(value);
    trackFirstInteraction();
  }

  const statCards: { label: string; value: string | number }[] = [
    { label: "Words", value: stats.words },
    { label: "Characters", value: stats.characters },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
    { label: "Sentences", value: stats.sentences },
    { label: "Paragraphs", value: stats.paragraphs },
    { label: "Lines", value: stats.lines },
    { label: "Avg. Word Length", value: stats.avgWordLength },
    { label: "Reading Time", value: stats.readingTime },
    { label: "Speaking Time", value: stats.speakingTime },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 block text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
      >
        &larr; Back to tools
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Word & Character Counter
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Count words, characters, sentences, and paragraphs. Estimate reading and
        speaking time. Results update as you type.
      </p>

      {/* Input */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Enter or paste your text
        </label>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Start typing or paste your text here…"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          rows={8}
          spellCheck={false}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {s.value}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Top Words */}
      {topWords.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Top Words
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {topWords.map((w) => (
              <div
                key={w.word}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                  {w.word}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{
                        width: `${(w.count / topWords[0].count) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">
                    {w.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          About This Tool
        </h2>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>
            Reading time is based on an average of 238 words per minute.
            Speaking time uses 150 words per minute.
          </li>
          <li>
            Sentences are detected by terminal punctuation (.!?). Paragraphs are
            separated by blank lines.
          </li>
          <li>
            Everything runs in your browser — no data is sent over the network.
          </li>
        </ul>
      </div>
    </div>
  );
}
