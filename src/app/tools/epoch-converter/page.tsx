import type { Metadata } from "next";
import EpochConverterTool from "./EpochConverterTool";

export const metadata: Metadata = {
  title: "Epoch / Timestamp Converter",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, UTC, local time, and ISO 8601. Free online tool — no signup required.",
  keywords: [
    "epoch converter",
    "unix timestamp converter",
    "timestamp to date",
    "date to timestamp",
    "epoch time",
    "unix time converter online",
  ],
  alternates: {
    canonical: "/tools/epoch-converter",
  },
  openGraph: {
    title: "Epoch / Timestamp Converter - DevBolt",
    description:
      "Convert Unix timestamps to dates and dates to timestamps. Supports seconds, milliseconds, and ISO 8601.",
    url: "/tools/epoch-converter",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Epoch / Timestamp Converter",
  url: "https://devbolt.dev/tools/epoch-converter",
  description:
    "Convert Unix timestamps to human-readable dates and vice versa. Supports seconds, milliseconds, UTC, local time, and ISO 8601.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function EpochConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EpochConverterTool />
    </>
  );
}
