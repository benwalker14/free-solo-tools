import type { Metadata } from "next";
import DateFormatTool from "./DateFormatTool";

export const metadata: Metadata = {
  title: "Date Format Tester",
  description:
    "Test date and time format patterns with live preview. Supports strftime (Python/C/Ruby), Moment.js, Day.js, and date-fns tokens. Free online tool — no signup required.",
  keywords: [
    "date format tester",
    "strftime tester",
    "date format online",
    "moment format tester",
    "date-fns format",
    "timestamp format tester",
    "datetime format",
    "strftime cheat sheet",
  ],
  alternates: {
    canonical: "/tools/date-format",
  },
  openGraph: {
    title: "Date Format Tester - DevBolt",
    description:
      "Test date/time format patterns with live preview. Supports strftime, Moment.js, and date-fns.",
    url: "/tools/date-format",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Date Format Tester",
  url: "https://devbolt.dev/tools/date-format",
  description:
    "Test date and time format patterns with live preview. Supports strftime, Moment.js / Day.js, and date-fns token systems.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function DateFormatPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DateFormatTool />
    </>
  );
}
