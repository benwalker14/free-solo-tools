import type { Metadata } from "next";
import DiffCheckerTool from "./DiffCheckerTool";

export const metadata: Metadata = {
  title: "Diff Checker",
  description:
    "Compare two blocks of text and see the differences highlighted side by side. Free online diff tool — no signup required.",
  keywords: [
    "diff checker",
    "text diff",
    "compare text",
    "text comparison",
    "online diff tool",
  ],
  alternates: {
    canonical: "/tools/diff-checker",
  },
  openGraph: {
    title: "Diff Checker - FreeSolo Tools",
    description:
      "Compare two blocks of text and see differences highlighted. Free online tool.",
    url: "/tools/diff-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Diff Checker",
  url: "https://free-solo-tools.vercel.app/tools/diff-checker",
  description:
    "Compare two blocks of text and see the differences highlighted side by side.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function DiffCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DiffCheckerTool />
    </>
  );
}
