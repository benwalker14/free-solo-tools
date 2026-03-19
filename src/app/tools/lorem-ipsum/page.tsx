import type { Metadata } from "next";
import LoremIpsumTool from "./LoremIpsumTool";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator",
  description:
    "Generate lorem ipsum placeholder text for your designs and layouts. Choose paragraphs, sentences, or words. Free online tool — no signup required.",
  keywords: [
    "lorem ipsum generator",
    "placeholder text",
    "dummy text generator",
    "lorem ipsum",
    "filler text",
    "lipsum generator",
  ],
  alternates: {
    canonical: "/tools/lorem-ipsum",
  },
  openGraph: {
    title: "Lorem Ipsum Generator - DevBolt",
    description:
      "Generate lorem ipsum placeholder text for designs and layouts.",
    url: "/tools/lorem-ipsum",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Lorem Ipsum Generator",
  url: "https://devbolt.dev/tools/lorem-ipsum",
  description:
    "Generate lorem ipsum placeholder text in paragraphs, sentences, or words for designs and layouts.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  isAccessibleForFree: true,
  browserRequirements: "Any modern web browser",
  creator: { "@type": "Organization", name: "DevBolt", url: "https://devbolt.dev" },
};

export default function LoremIpsumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoremIpsumTool />
    </>
  );
}
