import type { Metadata } from "next";
import TailwindGeneratorTool from "./TailwindGeneratorTool";

export const metadata: Metadata = {
  title: "Tailwind CSS Generator",
  description:
    "Build Tailwind CSS classes visually with live preview. Generate utility classes for layout, spacing, typography, borders, and effects — copy-ready code in seconds.",
  keywords: [
    "tailwind css generator",
    "tailwind builder",
    "tailwind class generator",
    "tailwind utility generator",
    "tailwind css builder online",
    "tailwind css playground",
    "tailwind visual builder",
    "tailwind component generator",
    "css utility class builder",
    "tailwind css tool",
  ],
  alternates: {
    canonical: "/tools/tailwind-generator",
  },
  openGraph: {
    title: "Tailwind CSS Generator - DevBolt",
    description:
      "Build Tailwind CSS classes visually with live preview and presets for buttons, cards, badges, and more.",
    url: "/tools/tailwind-generator",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Tailwind CSS Generator",
  url: "https://devbolt.dev/tools/tailwind-generator",
  description:
    "Build Tailwind CSS utility classes visually with a live preview. Configure layout, spacing, typography, borders, effects, and more — then copy the class string.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function TailwindGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TailwindGeneratorTool />
    </>
  );
}
