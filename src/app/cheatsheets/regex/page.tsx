import type { Metadata } from "next";
import RegexCheatSheet from "./RegexCheatSheet";

const BASE_URL = "https://devbolt.dev";

export const metadata: Metadata = {
  title: "Regex Cheat Sheet — Interactive Regular Expression Reference",
  description:
    "Complete regex cheat sheet with metacharacters, character classes, quantifiers, anchors, lookaround, flags, and 50+ common patterns. Search, filter, copy, and click to test any pattern instantly. Free interactive regular expression reference.",
  keywords: [
    "regex cheat sheet",
    "regular expression reference",
    "regex patterns",
    "regex metacharacters",
    "regex quantifiers",
    "regex lookahead",
    "regex lookbehind",
    "regex character classes",
    "regex flags",
    "regex examples",
    "regex quick reference",
    "regular expression cheat sheet",
  ],
  openGraph: {
    title: "Regex Cheat Sheet — Interactive Regular Expression Reference | DevBolt",
    description:
      "Complete interactive regex reference with search, filtering, copy-to-clipboard, and click-to-test integration. Covers metacharacters, quantifiers, lookaround, flags, and common patterns.",
    url: `${BASE_URL}/cheatsheets/regex`,
    type: "article",
  },
  alternates: {
    canonical: `${BASE_URL}/cheatsheets/regex`,
  },
};

const faqs = [
  {
    question: "What are the most common regex metacharacters?",
    answer:
      "The most common regex metacharacters are: . (matches any character except newline), ^ (start of string), $ (end of string), * (zero or more), + (one or more), ? (zero or one), \\ (escape character), | (alternation/OR), () (grouping and capturing), and [] (character class). These form the foundation of all regular expression patterns.",
  },
  {
    question: "How do lookaheads and lookbehinds work in regex?",
    answer:
      "Lookaheads and lookbehinds are zero-width assertions that match a position without consuming characters. A positive lookahead (?=abc) matches if 'abc' follows the current position. A negative lookahead (?!abc) matches if 'abc' does NOT follow. A positive lookbehind (?<=abc) matches if 'abc' precedes the current position. A negative lookbehind (?<!abc) matches if 'abc' does NOT precede. They are powerful for matching patterns that depend on surrounding context without including that context in the match.",
  },
  {
    question: "What's the difference between greedy and lazy quantifiers in regex?",
    answer:
      "Greedy quantifiers (*, +, {n,m}) match as many characters as possible while still allowing the overall pattern to match. Lazy quantifiers (*?, +?, {n,m}?) match as few characters as possible. For example, given the string '<b>bold</b>', the greedy pattern '<.*>' matches the entire string '<b>bold</b>', while the lazy pattern '<.*?>' matches just '<b>'. Use lazy quantifiers when you want the shortest possible match.",
  },
  {
    question: "How do I test and debug regex patterns?",
    answer:
      "You can test regex patterns using DevBolt's free Regex Tester tool at devbolt.dev/tools/regex-tester. It provides real-time match highlighting, capture group inspection, and match details as you type. For generating patterns from plain English descriptions, try the Regex Generator at devbolt.dev/tools/regex-generator. Both tools run entirely in your browser with no signup required.",
  },
];

export default function RegexCheatSheetPage() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Regex Cheat Sheet — Interactive Regular Expression Reference",
    description:
      "Complete interactive regex reference covering metacharacters, character classes, quantifiers, anchors, groups, lookaround, flags, and common patterns.",
    datePublished: "2026-03-19",
    publisher: {
      "@type": "Organization",
      name: "DevBolt",
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/cheatsheets/regex`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <RegexCheatSheet faqs={faqs} />
    </>
  );
}
