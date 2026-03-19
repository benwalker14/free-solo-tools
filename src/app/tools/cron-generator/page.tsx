import type { Metadata } from "next";
import CronGeneratorTool from "./CronGeneratorTool";

export const metadata: Metadata = {
  title: "Crontab Generator",
  description:
    "Build cron expressions visually with an interactive schedule builder. Select frequency, time, and days — get the cron expression instantly. Free online tool — no signup required.",
  keywords: [
    "cron generator",
    "crontab generator",
    "cron expression generator",
    "cron builder",
    "cron schedule builder",
    "crontab maker",
    "cron job generator",
    "cron expression builder",
    "visual cron editor",
    "cron schedule creator",
  ],
  alternates: {
    canonical: "/tools/cron-generator",
  },
  openGraph: {
    title: "Crontab Generator - DevBolt",
    description:
      "Build cron expressions visually with an interactive schedule builder.",
    url: "/tools/cron-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Crontab Generator",
  url: "https://devbolt.dev/tools/cron-generator",
  description:
    "Build cron expressions visually with an interactive schedule builder. Select frequency, time, and days — get the cron expression instantly.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function CronGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CronGeneratorTool />
    </>
  );
}
