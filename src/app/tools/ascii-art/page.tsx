import type { Metadata } from "next";
import AsciiArtTool from "./AsciiArtTool";

export const metadata: Metadata = {
  title: "ASCII Art Text Generator",
  description:
    "Convert text into ASCII art using multiple font styles. Generate banner text for READMEs, comments, terminals, and social media. Free, runs in your browser.",
  keywords: [
    "ascii art generator",
    "ascii text generator",
    "text to ascii art",
    "figlet online",
    "ascii banner generator",
    "text art generator",
    "ascii font generator",
    "code comment banner",
    "terminal ascii art",
    "readme ascii art",
  ],
  alternates: {
    canonical: "/tools/ascii-art",
  },
  openGraph: {
    title: "ASCII Art Text Generator - DevBolt",
    description:
      "Convert text into ASCII art using multiple font styles. Generate banner text for READMEs, comments, and terminals.",
    url: "/tools/ascii-art",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ASCII Art Text Generator",
  url: "https://devbolt.dev/tools/ascii-art",
  description:
    "Convert text into ASCII art using multiple font styles. Generate banner text for READMEs, comments, terminals, and social media. Free, runs entirely in your browser.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function AsciiArtPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AsciiArtTool />
    </>
  );
}
