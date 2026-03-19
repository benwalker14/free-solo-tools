import type { Metadata } from "next";
import DateFormatTesterTool from "./DateFormatTesterTool";

export const metadata: Metadata = {
  title: "Date Format Tester",
  description:
    "Test date format patterns for strftime, date-fns, Moment.js, Go, and Java SimpleDateFormat. Live preview with preset formats, token reference tables, and copy output. Free online tool — no signup required.",
  keywords: [
    "date format tester",
    "strftime tester",
    "date format online",
    "moment.js format",
    "date-fns format",
    "go time format",
    "java simpledateformat",
    "timestamp format tester",
    "date pattern tester",
    "strftime cheat sheet",
  ],
  alternates: {
    canonical: "/tools/date-format-tester",
  },
  openGraph: {
    title: "Date Format Tester - DevBolt",
    description:
      "Test date format patterns for strftime, date-fns, Moment.js, Go, and Java. Live preview with presets and token reference.",
    url: "/tools/date-format-tester",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Date Format Tester",
  url: "https://devbolt.dev/tools/date-format-tester",
  description:
    "Test date format patterns for strftime, date-fns, Moment.js, Go, and Java SimpleDateFormat. Live preview with preset formats and token reference tables.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function DateFormatTesterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DateFormatTesterTool />
    </>
  );
}
