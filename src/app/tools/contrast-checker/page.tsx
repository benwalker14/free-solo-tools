import type { Metadata } from "next";
import ContrastCheckerTool from "./ContrastCheckerTool";

export const metadata: Metadata = {
  title: "Color Contrast Checker (WCAG 2.1)",
  description:
    "Check the contrast ratio between two colors for WCAG 2.1 accessibility compliance. Test AA and AAA levels for normal text, large text, and UI components. Free online tool — no signup required.",
  keywords: [
    "color contrast checker",
    "WCAG contrast checker",
    "accessibility contrast ratio",
    "color accessibility",
    "WCAG 2.1 compliance",
    "contrast ratio calculator",
    "web accessibility tool",
    "AA AAA contrast",
    "color contrast tester",
  ],
  alternates: {
    canonical: "/tools/contrast-checker",
  },
  openGraph: {
    title: "Color Contrast Checker (WCAG 2.1) - DevBolt",
    description:
      "Check color contrast ratios for WCAG 2.1 AA and AAA accessibility compliance. Free online tool.",
    url: "/tools/contrast-checker",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Color Contrast Checker (WCAG 2.1)",
  url: "https://devbolt.dev/tools/contrast-checker",
  description:
    "Check the contrast ratio between two colors for WCAG 2.1 accessibility compliance. Test AA and AAA levels for normal text, large text, and UI components.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ContrastCheckerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContrastCheckerTool />
    </>
  );
}
