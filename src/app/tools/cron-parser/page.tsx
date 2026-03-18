import type { Metadata } from "next";
import CronParserTool from "./CronParserTool";

export const metadata: Metadata = {
  title: "Cron Expression Parser",
  description:
    "Parse and explain cron expressions with human-readable descriptions and next scheduled run times. Supports standard 5-field cron syntax. Free online tool — no signup required.",
  keywords: [
    "cron parser",
    "cron expression",
    "cron schedule",
    "crontab",
    "cron generator",
    "cron explained",
    "cron syntax",
    "cron job schedule",
    "cron next run",
    "crontab guru",
  ],
  alternates: {
    canonical: "/tools/cron-parser",
  },
  openGraph: {
    title: "Cron Expression Parser - DevBolt",
    description:
      "Parse cron expressions into human-readable descriptions with next scheduled runs.",
    url: "/tools/cron-parser",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Cron Expression Parser",
  url: "https://devbolt.dev/tools/cron-parser",
  description:
    "Parse and explain cron expressions with human-readable descriptions and next scheduled run times.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function CronParserPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CronParserTool />
    </>
  );
}
